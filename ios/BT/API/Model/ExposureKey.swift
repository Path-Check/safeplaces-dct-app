import Foundation
import ExposureNotification

struct ExposureKey: Codable {

  let key: Data
  let rollingPeriod: ENIntervalNumber
  let rollingStartNumber: ENIntervalNumber
  let transmissionRisk: ENRiskLevel

}
