import Foundation
import ExposureNotification
import RealmSwift

@objcMembers
class ExposureKey: Object, Codable {

  var keyData: Data!
  var rollingPeriod: ENIntervalNumber!
  var rollingStartNumber: ENIntervalNumber!
  var transmissionRiskLevel: ENRiskLevel!

  init(keyData: Data,
       rollingPeriod: ENIntervalNumber,
       rollingStartNumber: ENIntervalNumber,
       transmissionRiskLevel: ENRiskLevel) {
    self.keyData = keyData
    self.rollingPeriod = rollingPeriod
    self.rollingStartNumber = rollingStartNumber
    self.transmissionRiskLevel = transmissionRiskLevel
    super.init()
  }

  required init() {
    super.init()
  }
}
