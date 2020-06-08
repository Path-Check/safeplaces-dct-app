import Foundation
import ExposureNotification
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
  
  func detectExposures(completionHandler: ((Bool) -> Void)? = nil) -> Progress {
    
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
        APIClient.shared.request(DiagnosisKeyURLRequest.delete(localURL)) { _ in }
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
    let dispatchGroup = DispatchGroup()
    var localURLResults = [Result<URL>]()
    
    APIClient.shared.request(DiagnosisKeyURLListRequest.get) { result in
      switch result {
      case .success(let urls):
        let prunedUrls = urls[min(nextDiagnosisKeyFileIndex, urls.count)...]
        for remoteURL in prunedUrls {
          dispatchGroup.enter()
          APIClient.shared.request(DiagnosisKeyURLRequest.get(remoteURL)) { result in
            switch result {
            case .success:
              localURLResults.append(result)
            case .failure(let error):
              finish(.failure(error))
            }
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
        APIClient.shared.request(ExposureConfigurationRequest.get) { result in
          switch result {
          case .success(let configuration):
            let exposureConfiguration = configuration.asENExposureConfiguration
            ExposureManager.shared.manager.detectExposures(configuration: exposureConfiguration, diagnosisKeyURLs: localURLs) { summary, error in
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
          case .failure(let error):
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
        APIClient.shared.request(DiagnosisKeyListRequest.post((temporaryExposureKeys ?? []).compactMap { $0.asCodableKey })) { result in
          switch result {
          case .success(let urls):
            APIClient.shared.request(DiagnosisKeyListRequest.post(urls)) { result in
              switch result {
              case .success:
                break
              case .failure(let error):
                completion(error)
              }
            }
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
        APIClient.shared.request(DiagnosisKeyListRequest.post((temporaryExposureKeys ?? []).compactMap { $0.asCodableKey })) { result in
          switch result {
          case .success(let urls):
            APIClient.shared.request(DiagnosisKeyListRequest.post(urls)) { result in
              switch result {
              case .success:
                break
              case .failure(let error):
                completion(error)
              }
            }
            break
          case .failure(let error):
            completion(error)
          }
        }
      }
    }
  }
  
}
