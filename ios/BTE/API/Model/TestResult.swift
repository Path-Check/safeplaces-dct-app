import Foundation
import RealmSwift

@objcMembers
class TestResult: Object, Codable {
  @objc dynamic var id: String!                // A unique identifier for this test result
  dynamic var isAdded: Bool!           // Whether the user completed the add positive diagnosis flow for this test result
  @objc dynamic var dateAdministered: Date!  // The date the test was administered
  dynamic var isShared: Bool!          // Whether diagnosis keys were shared with the Health Authority for the purpose of notifying others
  init(id: String,
       isAdded: Bool,
       dateAdministered: Date,
       isShared: Bool) {
    self.id = id
    self.isAdded = isAdded
    self.dateAdministered = dateAdministered
    self.isShared = isShared
    super.init()
  }

  required init() {
    super.init()
  }

  override class func primaryKey() -> String? {
    "id"
  }
}
