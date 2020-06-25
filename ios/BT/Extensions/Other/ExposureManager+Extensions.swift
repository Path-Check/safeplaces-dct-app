import Foundation
import RealmSwift

extension ExposureManager {

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
      completion([NSNull(), "Exposures: \(BTSecureStorage.shared.exposures.count)"])
    case .toggleENAuthorization:
      let enabled = manager.exposureNotificationEnabled ? false : true
      requestExposureNotificationAuthorization(enabled: enabled) { result in
        completion([NSNull(), "EN Enabled: \(self.manager.exposureNotificationEnabled)"])
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
