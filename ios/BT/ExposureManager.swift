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
  
  @discardableResult func detectExposures(completionHandler: @escaping ((ExposureResult) -> Void)) -> Progress {
    
    let progress = Progress()
    
    var lastProcessedUrlPath: String = .default
    var processedFileCount: Int = 0
    
    // Disallow concurrent exposure detection, because if allowed we might try to detect the same diagnosis keys more than once
    guard !detectingExposures else {
      finish(.failure(ExposureError.default("Detection Already in Progress")),
             processedFileCount: processedFileCount,
             lastProcessedUrlPath: lastProcessedUrlPath,
             progress: progress,
             completionHandler: completionHandler)
      return progress
    }
    
    detectingExposures = true
    
    // Reset file capacity to 15 if > 24 hours have elapsed since last reset
    updateRemainingFileCapacity()
    
    // Abort if daily file capacity is exceeded
    guard BTSecureStorage.shared.userState.remainingDailyFileProcessingCapacity > 0 else {
      finish(.success([]),
             processedFileCount: processedFileCount,
             lastProcessedUrlPath: lastProcessedUrlPath,
             progress: progress,
             completionHandler: completionHandler)
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
              self.finish(.failure(error),
                          processedFileCount: processedFileCount,
                          lastProcessedUrlPath: lastProcessedUrlPath,
                          progress: progress,
                          completionHandler: completionHandler)
              return
            }
            dispatchGroup.leave()
          }
        }
        
      case let .failure(error):
        self.finish(.failure(error),
                    processedFileCount: processedFileCount,
                    lastProcessedUrlPath: lastProcessedUrlPath,
                    progress: progress,
                    completionHandler: completionHandler)
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
                self.finish(.failure(error),
                            processedFileCount: processedFileCount,
                            lastProcessedUrlPath: lastProcessedUrlPath,
                            progress: progress,
                            completionHandler: completionHandler)
                return
              }
              let userExplanation = NSLocalizedString(String.newExposureNotificationBody, comment: .default)
              ExposureManager.shared.manager.getExposureInfo(summary: summary!, userExplanation: userExplanation) { exposures, error in
                if let error = error {
                  self.finish(.failure(error),
                              processedFileCount: processedFileCount,
                              lastProcessedUrlPath: lastProcessedUrlPath,
                              progress: progress,
                              completionHandler: completionHandler)
                  return
                }
                let newExposures = (exposures ?? []).map { exposure in
                  Exposure(id: UUID().uuidString,
                           date: exposure.date.posixRepresentation,
                           duration: exposure.duration,
                           totalRiskScore: exposure.totalRiskScore,
                           transmissionRiskLevel: exposure.transmissionRiskLevel)
                }
                self.finish(.success(newExposures),
                            processedFileCount: processedFileCount,
                            lastProcessedUrlPath: lastProcessedUrlPath,
                            progress: progress,
                            completionHandler: completionHandler)
              }
            }
          }
        } catch(let error) {
          self.finish(.failure(error),
                      processedFileCount: processedFileCount,
                      lastProcessedUrlPath: lastProcessedUrlPath,
                      progress: progress,
                      completionHandler: completionHandler)
        }
      }
    }
    return progress
  }
  
  func finish(_ result: Result<[Exposure]>,
              processedFileCount: Int,
              lastProcessedUrlPath: String,
              progress: Progress,
              completionHandler: ((ExposureResult) -> Void)) {
    
    cleanup()

    detectingExposures = false

    if progress.isCancelled {
      BTSecureStorage.shared.exposureDetectionErrorLocalizedDescription = GenericError.unknown.localizedDescription
      completionHandler(.failure(ExposureError.cancelled))
    } else {
      switch result {
      case let .success(newExposures):
        BTSecureStorage.shared.exposureDetectionErrorLocalizedDescription = .default
        BTSecureStorage.shared.remainingDailyFileProcessingCapacity -= processedFileCount
        if lastProcessedUrlPath != .default {
          BTSecureStorage.shared.urlOfMostRecentlyDetectedKeyFile = lastProcessedUrlPath
        }
        BTSecureStorage.shared.storeExposures(newExposures)
        completionHandler(.success(processedFileCount))
      case let .failure(error):
        let exposureError = ExposureError.default(error.localizedDescription)
        BTSecureStorage.shared.exposureDetectionErrorLocalizedDescription = error.localizedDescription
        postExposureDetectionErrorNotification(exposureError.errorDescription)
        completionHandler(.failure(exposureError))
      }
    }
  }
  
  @objc func registerBackgroundTask() {
    notifyUserBlueToothOffIfNeeded()
    BGTaskScheduler.shared.register(forTaskWithIdentifier: ExposureManager.backgroundTaskIdentifier, using: .main) { [weak self] task in
      
      // Notify the user if bluetooth is off
      self?.notifyUserBlueToothOffIfNeeded()
      
      // Perform the exposure detection
      let progress = ExposureManager.shared.detectExposures { result in
        switch result {
        case .success:
          task.setTaskCompleted(success: true)
        case .failure:
          task.setTaskCompleted(success: false)
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

  @objc func getAndPostDiagnosisKeys(certificate: String,
                                     HMACKey: String,
                                     resolve: @escaping RCTPromiseResolveBlock,
                                     reject: @escaping RCTPromiseRejectBlock) {
    manager.getDiagnosisKeys { temporaryExposureKeys, error in
      if let error = error {
        reject(String.noExposureKeysFound, "Failed to get exposure keys", error)
      } else {
        
        let allKeys = (temporaryExposureKeys ?? [])
        
        // Filter keys > 350 hrs old
        let currentKeys = allKeys.current()

        APIClient.shared.request(DiagnosisKeyListRequest.post(currentKeys.compactMap { $0.asCodableKey }, [.US], certificate, HMACKey),
                                 requestType: .postKeys) { result in
                                  switch result {
                                  case .success:
                                    resolve("Submitted: \(currentKeys.count) keys.")
                                  case .failure(let error):
                                    reject(String.networkFailure, "Failed to post exposure keys \(error.localizedDescription)", error)
                                  }
        }
      }
    }
  }
  
  func postExposureDetectionErrorNotification(_ errorString: String?) {
    #if DEBUG
    let identifier = String.exposureDetectionErrorNotificationIdentifier
    
    let content = UNMutableNotificationContent()
    content.title = String.exposureDetectionErrorNotificationTitle.localized
    content.body = errorString ?? String.exposureDetectionErrorNotificationBody.localized
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
  
  func urlPathsToProcess(_ urlPaths: [String]) -> [String] {
    let startIdx = startIndex(for: urlPaths)
    let endIdx = min(startIdx + BTSecureStorage.shared.userState.remainingDailyFileProcessingCapacity, urlPaths.count)
    return Array(urlPaths[startIdx..<endIdx])
  }
  
  @objc func fetchExposureKeys(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    manager.getDiagnosisKeys { (keys, error) in
      if let error = error {
        print(error)
        reject("no_exposure_keys", "There was an error fetching the exposure keys \(error)", error);
      } else {
        resolve((keys ?? []).map { $0.asDictionary })
      }
    }
  }

  @objc var currentExposures: String {
    let exposures = Array(BTSecureStorage.shared.userState.exposures)
    return exposures.jsonStringRepresentation()
  }

  func updateRemainingFileCapacity() {
    guard let lastResetDate =  BTSecureStorage.shared.userState.dateLastPerformedFileCapacityReset else {
      BTSecureStorage.shared.dateLastPerformedFileCapacityReset = Date()
      BTSecureStorage.shared.remainingDailyFileProcessingCapacity = Constants.dailyFileProcessingCapacity
      return
    }
    
    // Reset remainingDailyFileProcessingCapacity if 24 hours have elapsed since last detection
    if  Date.hourDifference(from: lastResetDate, to: Date()) > 24 {
      BTSecureStorage.shared.remainingDailyFileProcessingCapacity = Constants.dailyFileProcessingCapacity
      BTSecureStorage.shared.dateLastPerformedFileCapacityReset = Date()
    }
  }
  
}

private extension ExposureManager {
  
  func startIndex(for urlPaths: [String]) -> Int {
    let path = BTSecureStorage.shared.userState.urlOfMostRecentlyDetectedKeyFile
    if let lastIdx = urlPaths.firstIndex(of: path) {
      return min(lastIdx + 1, urlPaths.count)
    }
    return 0
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
