import Foundation
import RealmSwift

@propertyWrapper
class Persisted<Value: Codable> {

  init(keyPath: String, notificationName: Notification.Name, defaultValue: Value) {
    self.keyPath = keyPath
    self.notificationName = notificationName
    self.wrappedValue = defaultValue
  }

  let keyPath: String
  let notificationName: Notification.Name

  var wrappedValue: Value {
    didSet {
      BTESecureStorage.shared.getUserState { userState in
        guard let realmConfig = BTESecureStorage.shared.getRealmConfig() else {
          return
        }
        let realm = try! Realm(configuration: realmConfig)
        try! realm.write {
          userState.setValue(wrappedValue, forKeyPath: keyPath)
          realm.add(userState, update: .modified)
        }
      }
      NotificationCenter.default.post(name: notificationName, object: nil)
    }
  }

  var projectedValue: Persisted<Value> { self }

  func addObserver(using block: @escaping () -> Void) -> NSObjectProtocol {
    return NotificationCenter.default.addObserver(forName: notificationName, object: nil, queue: nil) { _ in
      block()
    }
  }
}


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
