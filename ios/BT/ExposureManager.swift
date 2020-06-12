import Foundation
import ExposureNotification
import RealmSwift
import UserNotifications

@objc(ExposureManager)
final class ExposureManager: NSObject {
  
  @objc static let shared = ExposureManager()
  
  let manager = ENManager()
  
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
      
      if progress.isCancelled {
        detectingExposures = false
        completionHandler?(false)
      } else {
        switch result {
        case let .success((newExposures, nextDiagnosisKeyFileIndex)):
          BTSecureStorage.shared.nextDiagnosisKeyFileIndex = nextDiagnosisKeyFileIndex
          BTSecureStorage.shared.dateLastPerformedExposureDetection = Date()
          BTSecureStorage.shared.exposureDetectionErrorLocalizedDescription = .default
          BTSecureStorage.shared.exposures.append(objectsIn: newExposures)
          detectingExposures = false
          completionHandler?(true)
        case let .failure(error):
          BTSecureStorage.shared.exposureDetectionErrorLocalizedDescription = error.localizedDescription
          // Consider posting a user notification that an error occured
          detectingExposures = false
          completionHandler?(false)
        }
      }
      
    }
    
    BTSecureStorage.shared.getUserState { userState in
      APIClient.shared.request(DiagnosisKeyUrlListRequest.get(userState.nextDiagnosisKeyFileIndex), requestType: .get) { result in
        
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
          return
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
                    Exposure(id: UUID().uuidString,
                             date: exposure.date,
                             duration: exposure.duration,
                             totalRiskScore: exposure.totalRiskScore,
                             transmissionRiskLevel: exposure.transmissionRiskLevel)
                  }
                  finish(.success((newExposures, userState.nextDiagnosisKeyFileIndex + localURLs.count)))
                }
              }
              
            case let .failure(error):
              finish(.failure(error))
              return
            }
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
            completion(nil)
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
          completion([NSNull(), "Exposure detection successfully executed."])
        } else {
          completion(["Exposure detection error.", NSNull()])
        }
      }
    case .simulateExposureDetectionError:
      BTSecureStorage.shared.exposureDetectionErrorLocalizedDescription = "Unable to connect to server."
      completion([NSNull(), "Exposure deteaction error message: \(BTSecureStorage.shared.exposureDetectionErrorLocalizedDescription)"])
    case .simulateExposure:
      let exposure = Exposure(id: UUID().uuidString,
                              date: Date() - TimeInterval.random(in: 1...4) * 24 * 60 * 60,
                              duration: TimeInterval(Int.random(in: 1...5) * 60 * 5),
                              totalRiskScore: .random(in: 1...8),
                              transmissionRiskLevel: .random(in: 0...7))
      BTSecureStorage.shared.exposures.append(exposure)
      completion([NSNull(), "Exposures: \(BTSecureStorage.shared.exposures)"])
    case .simulatePositiveDiagnosis:
      let testResult = TestResult(id: UUID().uuidString,
                                  isAdded: true,
                                  dateAdministered: Date() - TimeInterval.random(in: 0...4) * 24 * 60 * 60,
                                  isShared: .random())
      BTSecureStorage.shared.testResults.append(testResult)
      completion([NSNull(), "Test results: \(BTSecureStorage.shared.testResults)"])
    case .disableExposureNotifications:
      manager.setExposureNotificationEnabled(false) { error in
        if let error = error {
          completion([error.localizedDescription, NSNull()])
        } else {
          completion([NSNull(), "Exposure Notifications disabled."])
        }
      }
    case .resetExposureDetectionError:
      BTSecureStorage.shared.exposureDetectionErrorLocalizedDescription = .default
      completion([NSNull(), "Exposure Detection Error: "])
      
    case .resetUserENState:
      BTSecureStorage.shared.resetUserState { userState in
        completion([NSNull(), "New UserState: \(userState)"])
      }
    case .getAndPostDiagnosisKeys:
      getAndPostTestDiagnosisKeys { error in
        if let error = error {
          completion([error.localizedDescription, NSNull()])
        } else {
          completion([NSNull(), "Local diagnosis keys successfully fetched and posted."])
        }
      }
    case .getExposureConfiguration:
      APIClient.shared.request(ExposureConfigurationRequest.get, requestType: .get) { result in
        switch result {
        case .success(let configuration):
          completion([NSNull(), "Exposure Configuration: \(configuration)"])
        case .failure(let error):
          completion([error.localizedDescription, NSNull()])
        }
      }
    }
  }
  
}
