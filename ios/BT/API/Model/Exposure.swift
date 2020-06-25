import ExposureNotification
import Foundation
import RealmSwift

@objcMembers
class Exposure: Object, Codable {
  var id: String!
  var date: Int!
  var duration: TimeInterval!
  var totalRiskScore: ENRiskScore!
  var transmissionRiskLevel: ENRiskLevel!

  init(id: String,
       date: Int,
       duration: TimeInterval,
       totalRiskScore: ENRiskScore,
       transmissionRiskLevel: ENRiskScore) {
    self.id = id
    self.date = date
    self.duration = duration
    self.totalRiskScore = totalRiskScore
    self.transmissionRiskLevel = transmissionRiskLevel
    super.init()
  }

  required init() {
    super.init()
  }

  override class func primaryKey() -> String? {
    "id"
  }

}
