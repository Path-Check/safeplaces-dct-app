import ExposureNotification
import Foundation
import RealmSwift

extension ExposureManager {

  @objc func handleDebugAction(_ action: DebugAction, callback: @escaping RCTResponseSenderBlock) {
    switch action {
    case .fetchDiagnosisKeys:
      manager.getDiagnosisKeys { (keys, error) in
        if let error = error {
          callback([error, NSNull()])
        } else {
          callback([NSNull(), keys!.map { $0.asDictionary }])
        }
      }
    case .detectExposuresNow:
      detectExposures { error in
        if let error = error {
          callback(["Exposure detection error: \((error as NSError).userInfo)", NSNull()])
        } else {
          callback([NSNull(), "Exposure detection successfully executed."])
        }
      }
    case .simulateExposureDetectionError:
      BTSecureStorage.shared.exposureDetectionErrorLocalizedDescription = "Unable to connect to server."
      ExposureManager.shared.postExposureDetectionErrorNotification()
      callback([NSNull(), "Exposure deteaction error message: \(BTSecureStorage.shared.exposureDetectionErrorLocalizedDescription)"])
    case .simulateExposure:
      ExposureManager.shared.postNewExposureNotification()
      let exposure = Exposure(id: UUID().uuidString,
                              date: Date().posixRepresentation - Int(TimeInterval.random(in: 0...13)) * 24 * 60 * 60 * 1000,
                              duration: TimeInterval(Int.random(in: 1...10) * 60 * 5 * 1000),
                              totalRiskScore: .random(in: 1...8),
                              transmissionRiskLevel: .random(in: 0...7))
      BTSecureStorage.shared.storeExposures([exposure])
      callback([NSNull(), "Exposures: \(BTSecureStorage.shared.exposures)"])
    case .resetExposureDetectionError:
      BTSecureStorage.shared.exposureDetectionErrorLocalizedDescription = .default
      callback([NSNull(), "Exposure Detection Error: "])
    case .getAndPostDiagnosisKeys:
      getAndPostDiagnosisKeys(callback: callback)
    case .resetExposures:
      BTSecureStorage.shared.exposures = List<Exposure>()
      callback([NSNull(), "Exposures: \(BTSecureStorage.shared.exposures.count)"])
    case .toggleENAuthorization:
      let enabled = manager.exposureNotificationEnabled ? false : true
      requestExposureNotificationAuthorization(enabled: enabled) { result in
        callback([NSNull(), "EN Enabled: \(self.manager.exposureNotificationEnabled)"])
      }
    }
  }

  // Includes today's key, requires com.apple.developer.exposure-notification-test entitlement
  func getAndPostTestDiagnosisKeys(completion: @escaping (Error?) -> Void) {
    manager.getTestDiagnosisKeys { temporaryExposureKeys, error in
      if let error = error {
        completion(error)
      } else {
        APIClient.shared.request(DiagnosisKeyListRequest.post((temporaryExposureKeys ?? []).compactMap { $0.asCodableKey }, [.US]), requestType: .postKeys) { result in
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

}
