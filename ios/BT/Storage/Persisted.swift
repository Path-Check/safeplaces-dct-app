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
      BTSecureStorage.shared.setUserValue(value: wrappedValue, keyPath: keyPath, notificationName: notificationName)
    }
  }

  var projectedValue: Persisted<Value> { self }

  func addObserver(using block: @escaping () -> Void) -> NSObjectProtocol {
    return NotificationCenter.default.addObserver(forName: notificationName, object: nil, queue: nil) { _ in
      block()
    }
  }
}
