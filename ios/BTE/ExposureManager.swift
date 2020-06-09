import Foundation
import ExposureNotification
import UserNotifications

@objc(ExposureManager)
final class ExposureManager: NSObject {
  
  @objc static let shared = ExposureManager()
  
  let manager = ENManager()
  
  private let secureStorage: BTESecureStorage = BTESecureStorage()
  
  var detectingExposures = false
  
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
  }
  
  deinit {
    manager.invalidate()
  }
  
  @objc func requestExposureNotificationAuthorization(_ callback: @escaping RCTResponseSenderBlock) {
    manager.setExposureNotificationEnabled(true) { error in
      if let error = error as? ENError, error.code == .notAuthorized {
        callback([String.notAuthorized])
      } else if let error = error {
        callback([error.localizedDescription])
      } else {
        callback([String.authorized])
      }
    }
  }
  
  @discardableResult func detectExposures(completionHandler: ((Bool) -> Void)? = nil) -> Progress {
    
    let progress = Progress()
    
    // Disallow concurrent exposure detection, because if allowed we might try to detect the same diagnosis keys more than once
    guard !detectingExposures else {
      completionHandler?(false)
      return progress
    }
    detectingExposures = true
    
    var localURLs = [URL]()
    
    func finish(_ result: Result<([Exposure], Int)>) {
      
      for localURL in localURLs {
        APIClient.shared.request(DiagnosisKeyRequest.delete(localURL), requestType: .post, completion: { _ in })
      }
      
      let success: Bool
      if progress.isCancelled {
        success = false
      } else {
        switch result {
        case let .success((newExposures, nextDiagnosisKeyFileIndex)):
          LocalStore.shared.nextDiagnosisKeyFileIndex = nextDiagnosisKeyFileIndex
          LocalStore.shared.exposures.append(contentsOf: newExposures)
          LocalStore.shared.exposures.sort { $0.date < $1.date }
          LocalStore.shared.dateLastPerformedExposureDetection = Date()
          LocalStore.shared.exposureDetectionErrorLocalizedDescription = nil
          success = true
        case let .failure(error):
          LocalStore.shared.exposureDetectionErrorLocalizedDescription = error.localizedDescription
          // Consider posting a user notification that an error occured
          success = false
        }
      }
      
      detectingExposures = false
      completionHandler?(success)
    }
    let nextDiagnosisKeyFileIndex = LocalStore.shared.nextDiagnosisKeyFileIndex
    
    APIClient.shared.request(DiagnosisKeyUrlListRequest.get(nextDiagnosisKeyFileIndex), requestType: .get) { result in
      
      let dispatchGroup = DispatchGroup()
      var localURLResults = [Result<URL>]()
      
      switch result {
      case let .success(remoteURLs):
        for remoteURL in remoteURLs {
          dispatchGroup.enter()
          APIClient.shared.request(DiagnosisKeyUrlRequest.get(remoteURL), requestType: .get) { result in
            localURLResults.append(result)
            dispatchGroup.leave()
          }
        }
        
      case let .failure(error):
        finish(.failure(error))
      }
      dispatchGroup.notify(queue: .main) {
        for result in localURLResults {
          switch result {
          case let .success(localURL):
            localURLs.append(localURL)
          case let .failure(error):
            finish(.failure(error))
            return
          }
        }
        APIClient.shared.request(ExposureConfigurationRequest.get, requestType: .get) { result in
          switch result {
          case let .success(configuration):
            let enConfiguration = configuration.asENExposureConfiguration
            ExposureManager.shared.manager.detectExposures(configuration: enConfiguration, diagnosisKeyURLs: localURLs) { summary, error in
              if let error = error {
                finish(.failure(error))
                return
              }
              let userExplanation = NSLocalizedString("USER_NOTIFICATION_EXPLANATION", comment: "User notification")
              ExposureManager.shared.manager.getExposureInfo(summary: summary!, userExplanation: userExplanation) { exposures, error in
                if let error = error {
                  finish(.failure(error))
                  return
                }
                let newExposures = exposures!.map { exposure in
                  Exposure(date: exposure.date,
                           duration: exposure.duration,
                           totalRiskScore: exposure.totalRiskScore,
                           transmissionRiskLevel: exposure.transmissionRiskLevel)
                }
                finish(.success((newExposures, nextDiagnosisKeyFileIndex + localURLs.count)))
              }
            }
            
          case let .failure(error):
            finish(.failure(error))
          }
        }
      }
    }
    
    return progress
  }
  
  func getAndPostDiagnosisKeys(completion: @escaping (Error?) -> Void) {
    manager.getDiagnosisKeys { temporaryExposureKeys, error in
      if let error = error {
        completion(error)
      } else {
        APIClient.shared.request(DiagnosisKeyListRequest.post((temporaryExposureKeys ?? []).compactMap { $0.asCodableKey }), requestType: .post) { result in
          switch result {
          case .success:
            break
          case .failure(let error):
            completion(error)
          }
        }
      }
    }
  }
  
  // Includes today's key, requires com.apple.developer.exposure-notification-test entitlement
  func getAndPostTestDiagnosisKeys(completion: @escaping (Error?) -> Void) {
    manager.getTestDiagnosisKeys { temporaryExposureKeys, error in
      if let error = error {
        completion(error)
      } else {
        APIClient.shared.request(DiagnosisKeyListRequest.post((temporaryExposureKeys ?? []).compactMap { $0.asCodableKey }), requestType: .post) { result in
          switch result {
          case .success:
            break
          case .failure(let error):
            completion(error)
          }
        }
      }
    }
  }
  
  @objc func handleDebugAction(_ action: DebugAction, completion: @escaping RCTResponseSenderBlock) {
    switch action {
    case .fetchDiagnosisKeys:
      manager.getDiagnosisKeys { (keys, error) in
        if let error = error {
          completion([error, NSNull()])
        } else {
          completion([NSNull(), keys!.map { $0.asDictionary }])
        }
      }
    case .detectExposuresNow:
      detectExposures { success in
        if success {
          completion([NSNull(), NSNull()])
        } else {
          completion(["Exposure detection error.", NSNull()])
        }
      }
    case .simulateExposureDetectionError:
      LocalStore.shared.exposureDetectionErrorLocalizedDescription = "Unable to connect to server."
      completion([NSNull(), LocalStore.shared.exposureDetectionErrorLocalizedDescription])
    case .simulateExposure:
      let exposure = Exposure(date: Date() - TimeInterval.random(in: 1...4) * 24 * 60 * 60,
                              duration: TimeInterval(Int.random(in: 1...5) * 60 * 5),
                              totalRiskScore: .random(in: 1...8),
                              transmissionRiskLevel: .random(in: 0...7))
      LocalStore.shared.exposures.append(exposure)
      completion([NSNull(), LocalStore.shared.exposures])
    case .simulatePositiveDiagnosis:
      let testResult = TestResult(id: UUID(),
                                  isAdded: true,
                                  dateAdministered: Date() - TimeInterval.random(in: 0...4) * 24 * 60 * 60,
                                  isShared: .random())
      LocalStore.shared.testResults[testResult.id] = testResult
      completion([NSNull(), LocalStore.shared.testResults])
    case .disableExposureNotifications:
      manager.setExposureNotificationEnabled(false) { error in
        if let error = error {
          completion([error.localizedDescription, NSNull()])
        } else {
          completion([NSNull(), NSNull()])
        }
      }
    case .resetExposureDetectionError:
      LocalStore.shared.exposureDetectionErrorLocalizedDescription = nil
      completion([NSNull(), NSNull()])
    case .resetLocalExposures:
      LocalStore.shared.nextDiagnosisKeyFileIndex = 0
      LocalStore.shared.exposures = []
      LocalStore.shared.dateLastPerformedExposureDetection = nil
      completion([NSNull(), NSNull()])
    case .resetLocalTestResults:
      LocalStore.shared.testResults = [:]
      completion([NSNull(), NSNull()])
    case .getAndPostDiagnosisKeys:
      getAndPostTestDiagnosisKeys { error in
        if let error = error {
          completion([error.localizedDescription, NSNull()])
        } else {
          completion([NSNull(), NSNull()])
        }
      }
    case .getExposureConfiguration:
      APIClient.shared.request(ExposureConfigurationRequest.get, requestType: .get) { result in
        switch result {
        case .success(let configuration):
          completion([NSNull(), "Configuration: \(configuration)"])
        case .failure(let error):
          completion([error.localizedDescription, NSNull()])
        }
      }
    }
  }
  
}

@objc enum DebugAction: Int {
  case fetchDiagnosisKeys,
  detectExposuresNow,
  simulateExposureDetectionError,
  simulateExposure,
  simulatePositiveDiagnosis,
  disableExposureNotifications,
  resetExposureDetectionError,
  resetLocalExposures,
  resetLocalTestResults,
  getAndPostDiagnosisKeys,
  getExposureConfiguration
}
