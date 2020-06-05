import Foundation
import ExposureNotification

struct ExposureKey: Codable, Equatable {
  let keyData: Data
  let rollingPeriod: ENIntervalNumber
  let rollingStartNumber: ENIntervalNumber
  let transmissionRiskLevel: ENRiskLevel
}
