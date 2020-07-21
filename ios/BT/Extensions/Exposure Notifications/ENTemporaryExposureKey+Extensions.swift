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

  static func rollingStartNumber(_ date: Date) -> UInt32 {
    UInt32(Int(date.timeIntervalSince1970 / (24 * 60 * 60)) * Constants.intervalsPerRollingPeriod)
  }

}
