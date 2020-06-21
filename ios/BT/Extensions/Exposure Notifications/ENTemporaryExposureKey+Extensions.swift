import Foundation
import ExposureNotification

extension ENTemporaryExposureKey {

  var asCodableKey: ExposureKey {
    ExposureKey(key: keyData,
                rollingPeriod: rollingPeriod,
                rollingStartNumber: rollingStartNumber,
                transmissionRisk: transmissionRiskLevel)
  }

  var asDictionary : [String: Any] {
    return [
      "key": keyData,
      "rollingPeriod": rollingPeriod,
      "rollingStartNumber": rollingStartNumber,
      "transmissionRisk": transmissionRiskLevel
    ]
  }

}
