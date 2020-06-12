import Foundation
import RealmSwift

@objcMembers
class UserState: Object {
  static let id = 0

  @objc dynamic var id: Int = UserState.id
  @objc dynamic var nextDiagnosisKeyFileIndex: Int = 0
  @objc dynamic var dateLastPerformedExposureDetection: Date? = nil
  @objc dynamic var exposureDetectionErrorLocalizedDescription: String = .default
  dynamic var exposures: List<Exposure> = List<Exposure>()
  dynamic var testResults: List<TestResult> = List<TestResult>()

  override class func primaryKey() -> String? {
    "id"
  }

}
