import ExposureNotification
import Foundation
import RealmSwift

extension ExposureManager {
  
  @objc func handleDebugAction(_ action: DebugAction,
                               resolve: @escaping RCTPromiseResolveBlock,
                               reject: @escaping RCTPromiseRejectBlock) {
    switch action {
    case .fetchDiagnosisKeys:
      manager.getDiagnosisKeys { (keys, error) in
        if let error = error {
          reject(error.localizedDescription, "Failed to get exposure keys", error)
        } else {
          resolve(keys!.map { $0.asDictionary })
        }
      }
    case .detectExposuresNow:
      guard BTSecureStorage.shared.userState.remainingDailyFileProcessingCapacity > 0 else {
        let hoursRemaining = 24 - Date.hourDifference(from: BTSecureStorage.shared.userState.dateLastPerformedFileCapacityReset ?? Date(), to: Date())
        reject("You have reached the exposure file submission limit. Please wait \(hoursRemaining) hours before detecting exposures again.", "Failed to detect Exposures", GenericError.unknown)
        return
      }
      
      detectExposures { error in
        if let error = error {
          reject(error.localizedDescription, "Failed to detect Exposures", error)
        } else {
          resolve("Exposure detection successfully executed.")
        }
      }
    case .simulateExposureDetectionError:
      BTSecureStorage.shared.exposureDetectionErrorLocalizedDescription = "Unable to connect to server."
      ExposureManager.shared.postExposureDetectionErrorNotification()
      resolve(String.genericSuccess)
    case .simulateExposure:
      let exposure = Exposure(id: UUID().uuidString,
                              date: Date().posixRepresentation - Int(TimeInterval.random(in: 0...13)) * 24 * 60 * 60 * 1000,
                              duration: TimeInterval(Int.random(in: 1...10) * 60 * 5 * 1000),
                              totalRiskScore: .random(in: 1...8),
                              transmissionRiskLevel: .random(in: 0...7))
      BTSecureStorage.shared.storeExposures([exposure])
      resolve("Exposures: \(BTSecureStorage.shared.userState.exposures)")
    case .getAndPostDiagnosisKeys:
      getAndPostDiagnosisKeys(certificate: .default, HMACKey: .default, resolve: resolve, reject: reject)
    case .resetExposures:
      BTSecureStorage.shared.exposures = List<Exposure>()
      resolve("Exposures: \(BTSecureStorage.shared.exposures.count)")
    case .toggleENAuthorization:
      let enabled = manager.exposureNotificationEnabled ? false : true
      requestExposureNotificationAuthorization(enabled: enabled) { result in
        resolve("EN Enabled: \(self.manager.exposureNotificationEnabled)")
      }
    }
  }
  
}
