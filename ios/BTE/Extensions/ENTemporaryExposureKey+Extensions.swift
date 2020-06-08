import Foundation
import ExposureNotification

extension ENTemporaryExposureKey {
  var asCodableKey: ExposureKey {
    ExposureKey(keyData: keyData,
                rollingPeriod: rollingPeriod,
                rollingStartNumber: rollingStartNumber,
                transmissionRiskLevel: transmissionRiskLevel)
  }
}
