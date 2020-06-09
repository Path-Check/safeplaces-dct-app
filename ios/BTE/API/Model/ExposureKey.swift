import Foundation
import ExposureNotification
import RealmSwift

@objcMembers
class ExposureKey: Object, Codable {
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
    fatalError("init() has not been implemented")
  }

  let keyData: Data
  let rollingPeriod: ENIntervalNumber
  let rollingStartNumber: ENIntervalNumber
  let transmissionRiskLevel: ENRiskLevel
}
