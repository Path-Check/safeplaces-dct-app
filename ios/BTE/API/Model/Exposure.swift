import ExposureNotification
import Foundation

struct Exposure: Codable {
  let date: Date
  let duration: TimeInterval
  let totalRiskScore: ENRiskScore
  let transmissionRiskLevel: ENRiskLevel
}
