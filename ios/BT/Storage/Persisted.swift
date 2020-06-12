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
      BTSecureStorage.shared.getUserState { userState in
        guard let realmConfig = BTSecureStorage.shared.getRealmConfig() else {
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
