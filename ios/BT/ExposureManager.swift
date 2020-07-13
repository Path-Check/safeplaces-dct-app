import Foundation
import ExposureNotification
import RealmSwift
import UserNotifications
import BackgroundTasks

@objc(ExposureManager)
final class ExposureManager: NSObject {
  
  @objc static let shared = ExposureManager()
  
  private static let backgroundTaskIdentifier = "\(Bundle.main.bundleIdentifier!).exposure-notification"
  
  let manager = ENManager()
  
  var detectingExposures = false

  private func rollingStartNumber(_ date: Date) -> Int {
    Int(date.timeIntervalSince1970 / (24 * 60 * 60)) * Constants.intervalsPerRollingPeriod
  }

  private var minRollingStartNumber: Int {
    let date = Calendar.current.date(byAdding: .hour, value: -Constants.exposureLifetimeHours, to: Date())!
    return rollingStartNumber(date)
  }
  
  enum EnabledState: String {
    case ENABLED, DISABLED
  }
  
  enum AuthorizationState: String {
    case AUTHORIZED, UNAUTHORIZED
  }
  
  typealias DeviceState = (AuthorizationState, EnabledState)
  
  override init() {
    super.init()
    manager.activate { _ in
      // Ensure exposure notifications are enabled if the app is authorized. The app
      // could get into a state where it is authorized, but exposure
      // notifications are not enabled,  if the user initially denied Exposure Notifications
      // during onboarding, but then flipped on the "COVID-19 Exposure Notifications" switch
      // in Settings.
      if ENManager.authorizationStatus == .authorized && !self.manager.exposureNotificationEnabled {
        self.manager.setExposureNotificationEnabled(true) { _ in
          // No error handling for attempts to enable on launch
        }
      }
    }
    
    // Schedule background task if needed whenever EN authorization status changes
    NotificationCenter.default.addObserver(self, selector: #selector(scheduleBackgroundTaskIfNeeded), name: .AuthorizationStatusDidChange, object: nil)
  }
  
  deinit {
    manager.invalidate()
  }
  
  @objc func requestExposureNotificationAuthorization(enabled: Bool, callback: @escaping RCTResponseSenderBlock) {
    // Ensure exposure notifications are enabled if the app is authorized. The app
    // could get into a state where it is authorized, but exposure
    // notifications are not enabled,  if the user initially denied Exposure Notifications
    // during onboarding, but then flipped on the "COVID-19 Exposure Notifications" switch
    // in Settings.
    manager.setExposureNotificationEnabled(enabled) { error in
      if let error = error {
        callback([error])
      } else {
        let enablement = self.manager.exposureNotificationEnabled ? EnabledState.ENABLED : EnabledState.DISABLED
        let authorization = ENManager.authorizationStatus == .authorized ? AuthorizationState.AUTHORIZED : AuthorizationState.UNAUTHORIZED
        NotificationCenter.default.post(Notification(name: Notification.Name.AuthorizationStatusDidChange,
                                                     object: [authorization.rawValue, enablement.rawValue],
                                                     userInfo: nil))
        callback([String.genericSuccess])
      }
    }
  }
  
  @objc func getCurrentENPermissionsStatus(callback: @escaping RCTResponseSenderBlock) {
    let enablement = self.manager.exposureNotificationEnabled ? EnabledState.ENABLED : EnabledState.DISABLED
    let authorization = ENManager.authorizationStatus == .authorized ? AuthorizationState.AUTHORIZED : AuthorizationState.UNAUTHORIZED
    callback([[authorization.rawValue, enablement.rawValue]])
  }
  
  /// Downloaded archives from the GAEN server
  var downloadedPackages = [DownloadedPackage]()
  
  /// Local urls of the bin/sig files from each archive
  var localUncompressedURLs = [URL]()
  
  @discardableResult func detectExposures(completionHandler: ((Error?) -> Void)? = nil) -> Progress {
    
    let progress = Progress()

    var lastProcessedUrlPath: String = .default
    var processedFileCount: Int = 0

    // Disallow concurrent exposure detection, because if allowed we might try to detect the same diagnosis keys more than once
    guard !detectingExposures else {
      completionHandler?(GenericError.unknown)
      return progress
    }
    
    detectingExposures = true

    // Reset file capacity to 15 if > 24 hours have elapsed since last reset
    updateRemainingFileCapacity()

    func finish(_ result: Result<[Exposure]>) {
      
      cleanup()

      if progress.isCancelled {
        detectingExposures = false
        completionHandler?(GenericError.unknown)
      } else {
        switch result {
        case let .success(newExposures):
          BTSecureStorage.shared.exposureDetectionErrorLocalizedDescription = .default
          BTSecureStorage.shared.exposures.append(objectsIn: newExposures)
          BTSecureStorage.shared.urlOfMostRecentlyDetectedKeyFile = lastProcessedUrlPath
          BTSecureStorage.shared.remainingDailyFileProcessingCapacity -= processedFileCount
          detectingExposures = false
          completionHandler?(nil)
        case let .failure(error):
          BTSecureStorage.shared.exposureDetectionErrorLocalizedDescription = error.localizedDescription
          detectingExposures = false
          postExposureDetectionErrorNotification()
          completionHandler?(error)
        }
      }
      
    }

    // Abort if daily file capacity is exceeded
    guard BTSecureStorage.shared.userState.remainingDailyFileProcessingCapacity > 0 else {
      finish(.success([]))
      return progress
    }

    APIClient.shared.requestString(IndexFileRequest.get, requestType: .downloadKeys) { result in
      let dispatchGroup = DispatchGroup()

      switch result {
      case let .success(indexFileString):
        let remoteURLs = indexFileString.gaenFilePaths
        let targetUrls = self.urlPathsToProcess(remoteURLs)
        lastProcessedUrlPath = targetUrls.last ?? .default
        processedFileCount = targetUrls.count
        for remoteURL in targetUrls {
          dispatchGroup.enter()
          APIClient.shared.downloadRequest(DiagnosisKeyUrlRequest.get(remoteURL), requestType: .downloadKeys) { result in
            switch result {
            case .success (let package):
              self.downloadedPackages.append(package)
            case .failure(let error):
              print("Error downloading from remote url (\(remoteURL): \(error)")
            }
            dispatchGroup.leave()
          }
        }

      case let .failure(error):
        finish(.failure(error))
        return
      }
      dispatchGroup.notify(queue: .main) {
        do {
          try self.downloadedPackages.unpack { urls in
            self.localUncompressedURLs = urls

            // TODO: Fetch configuration from API
            let enConfiguration = ExposureConfiguration.placeholder.asENExposureConfiguration
            ExposureManager.shared.manager.detectExposures(configuration: enConfiguration, diagnosisKeyURLs: self.localUncompressedURLs) { summary, error in
              if let error = error {
                finish(.failure(error))
                return
              }
              let userExplanation = NSLocalizedString(String.newExposureNotificationBody, comment: "User notification")
              ExposureManager.shared.manager.getExposureInfo(summary: summary!, userExplanation: userExplanation) { exposures, error in
                if let error = error {
                  finish(.failure(error))
                  return
                }
                let newExposures = (exposures ?? []).map { exposure in
                  Exposure(id: UUID().uuidString,
                           date: exposure.date.posixRepresentation,
                           duration: exposure.duration,
                           totalRiskScore: exposure.totalRiskScore,
                           transmissionRiskLevel: exposure.transmissionRiskLevel)
                }
                if !newExposures.isEmpty {
                  self.postNewExposureNotification()
                }
                finish(.success(newExposures))
              }
            }
          }
        } catch(let error) {
          finish(.failure(error))
        }
      }
    }
    
    return progress
  }
  
  @objc func registerBackgroundTask() {
    notifyUserBlueToothOffIfNeeded()
    BGTaskScheduler.shared.register(forTaskWithIdentifier: ExposureManager.backgroundTaskIdentifier, using: .main) { [weak self] task in
      
      // Notify the user if bluetooth is off
      self?.notifyUserBlueToothOffIfNeeded()
      
      // Perform the exposure detection
      let progress = ExposureManager.shared.detectExposures { error in
        if error != nil {
          task.setTaskCompleted(success: false)
        } else {
          task.setTaskCompleted(success: true)
        }
      }
      
      // Handle running out of time
      task.expirationHandler = {
        progress.cancel()
        BTSecureStorage.shared.exposureDetectionErrorLocalizedDescription = NSLocalizedString("BACKGROUND_TIMEOUT", comment: "Error")
      }
      
      // Schedule the next background task
      self?.scheduleBackgroundTaskIfNeeded()
    }
  }

  @objc func scheduleBackgroundTaskIfNeeded() {
    guard ENManager.authorizationStatus == .authorized else { return }
    let taskRequest = BGProcessingTaskRequest(identifier: ExposureManager.backgroundTaskIdentifier)
    taskRequest.requiresNetworkConnectivity = true
    do {
      try BGTaskScheduler.shared.submit(taskRequest)
    } catch {
      print("Unable to schedule background task: \(error)")
    }
  }

  @objc func getAndPostDiagnosisKeys(callback: @escaping RCTResponseSenderBlock) {
    manager.getDiagnosisKeys { temporaryExposureKeys, error in
      if let error = error {
        callback([error])
      } else {

        let allKeys = (temporaryExposureKeys ?? [])

        // Filter keys > 350 hrs old
        let currentKeys = allKeys.filter { $0.rollingStartNumber > self.minRollingStartNumber }


        APIClient.shared.request(DiagnosisKeyListRequest.post(currentKeys.compactMap { $0.asCodableKey },
                                                              [.US]),
                                 requestType: .postKeys) { result in
                                  switch result {
                                  case .success:
                                    callback([NSNull(), String.genericSuccess])
                                  case .failure(let error):
                                    callback([error, NSNull()])
                                  }
        }
      }
    }
  }

  func postExposureDetectionErrorNotification() {
    #if DEBUG
    let identifier = String.exposureDetectionErrorNotificationIdentifier

    let content = UNMutableNotificationContent()
    content.title = String.exposureDetectionErrorNotificationTitle.localized
    content.body = String.exposureDetectionErrorNotificationBody.localized
    content.sound = .default
    let request = UNNotificationRequest(identifier: identifier, content: content, trigger: nil)
    UNUserNotificationCenter.current().add(request) { error in
      DispatchQueue.main.async {
        if let error = error {
          print("Error showing error user notification: \(error)")
        }
      }
    }
    #endif
  }

  func postNewExposureNotification() {
    let identifier = String.exposureDetectionErrorNotificationIdentifier

    let content = UNMutableNotificationContent()
    content.title = String.newExposureNotificationTitle.localized
    content.body = String.newExposureNotificationBody.localized
    content.sound = .default
    let request = UNNotificationRequest(identifier: identifier, content: content, trigger: nil)
    UNUserNotificationCenter.current().add(request) { error in
      DispatchQueue.main.async {
        if let error = error {
          print("Error showing error user notification: \(error)")
        }
      }
    }
  }
  
}

private extension ExposureManager {

  func updateRemainingFileCapacity() {
    guard let lastResetDate =  BTSecureStorage.shared.userState.dateLastPerformedFileCapacityReset else {
      BTSecureStorage.shared.dateLastPerformedFileCapacityReset = Date()
      BTSecureStorage.shared.remainingDailyFileProcessingCapacity = Constants.dailyFileProcessingCapacity
      return
    }

    // Reset remainingDailyFileProcessingCapacity if 24 hours have elapsed since last detection
    if Date().difference(from: lastResetDate, only: .hour) >= 24 {
      BTSecureStorage.shared.remainingDailyFileProcessingCapacity = Constants.dailyFileProcessingCapacity
      BTSecureStorage.shared.dateLastPerformedFileCapacityReset = Date()
    }
  }

  func startIndex(for urlPaths: [String]) -> Int {
    let path = BTSecureStorage.shared.userState.urlOfMostRecentlyDetectedKeyFile
    return urlPaths.firstIndex(of: path) ?? 0
  }

  func urlPathsToProcess(_ urlPaths: [String]) -> [String] {
    let startIdx = startIndex(for: urlPaths)
    let endIdx = min(startIdx + BTSecureStorage.shared.userState.remainingDailyFileProcessingCapacity, urlPaths.count - startIdx)
    return Array(urlPaths[startIdx..<endIdx])
  }

  func notifyUserBlueToothOffIfNeeded() {
    let identifier = String.bluetoothNotificationIdentifier
    
    // Bluetooth must be enabled in order for the device to exchange keys with other devices
    if ENManager.authorizationStatus == .authorized && manager.exposureNotificationStatus == .bluetoothOff {
      let content = UNMutableNotificationContent()
      content.title = String.bluetoothNotificationTitle.localized
      content.body = String.bluetoothNotificationBody.localized
      content.sound = .default
      let request = UNNotificationRequest(identifier: identifier, content: content, trigger: nil)
      UNUserNotificationCenter.current().add(request) { error in
        DispatchQueue.main.async {
          if let error = error {
            print("Error showing error user notification: \(error)")
          }
        }
      }
    } else {
      UNUserNotificationCenter.current().removeDeliveredNotifications(withIdentifiers: [identifier])
    }
  }
  
  func cleanup() {
    // Delete downloaded files from file system
    localUncompressedURLs.cleanup()
    localUncompressedURLs = []
    downloadedPackages = []
  }
  
}
