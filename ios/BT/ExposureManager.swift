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
  
  @objc func requestExposureNotificationAuthorization(authorized: Bool, callback: @escaping RCTResponseSenderBlock) {
    manager.setExposureNotificationEnabled(authorized) { error in
      NotificationCenter.default.post(Notification(name: Notification.Name.AuthorizationStatusDidChange,
                                                   object: ENManager.authorizationStatus.rawValue,
                                                   userInfo: nil))
    }
  }
  
  @discardableResult func detectExposures(completionHandler: ((Bool) -> Void)? = nil) -> Progress {
    Progress()
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
                              date: Date().posixRepresentation - Int(TimeInterval.random(in: 0...13)) * 24 * 60 * 60 * 1000,
                              duration: TimeInterval(Int.random(in: 1...10) * 60 * 5 * 1000),
                              totalRiskScore: .random(in: 1...8),
                              transmissionRiskLevel: .random(in: 0...7))
      let exposures = BTSecureStorage.shared.exposures
      exposures.append(exposure)
      BTSecureStorage.shared.exposures = exposures
      completion([NSNull(), "Exposures: \(BTSecureStorage.shared.exposures)"])
    case .resetExposureDetectionError:
      BTSecureStorage.shared.exposureDetectionErrorLocalizedDescription = .default
      completion([NSNull(), "Exposure Detection Error: "])
    case .getAndPostDiagnosisKeys:
      getAndPostTestDiagnosisKeys { error in
        if let error = error {
          completion([error.localizedDescription, NSNull()])
        } else {
          completion([NSNull(), "Local diagnosis keys successfully fetched and posted."])
        }
      }
    case .resetExposures:
      BTSecureStorage.shared.exposures = List<Exposure>()
      completion([NSNull(), "Exposures: \(BTSecureStorage.shared.exposures)"])
    case .toggleENAuthorization:
      let authorized = ENManager.authorizationStatus == .authorized ? false : true
      requestExposureNotificationAuthorization(authorized: authorized) { result in
        completion([NSNull(), "EN Enabled: \(self.manager.exposureNotificationEnabled)"])
      }
    }
  }
  
}
