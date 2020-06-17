import Foundation
import ExposureNotification

extension ENTemporaryExposureKey {

  var asCodableKey: ExposureKey {
    ExposureKey(key: keyData,
                rollingPeriod: rollingPeriod,
                rollingStartNumber: rollingStartNumber,
                transmissionRisk: ENRiskLevel(Int(Double.random(in: 1...8))))
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
