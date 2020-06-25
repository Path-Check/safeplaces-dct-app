import ExposureNotification
import Foundation
import RealmSwift

final class BTSecureStorage: SafePathsSecureStorage {

  static let shared = BTSecureStorage()

  override var keychainIdentifier: String {
    "org.pathcheck.bt.realm"
  }

  private lazy var realmConfig: Realm.Configuration = {
    guard let realmConfig = getRealmConfig() else {
      fatalError("Missing realm configuration")
    }
    return realmConfig
  }()

  override func getRealmConfig() -> Realm.Configuration? {
    if let key = getEncryptionKey() {
      if (inMemory) {
        return Realm.Configuration(inMemoryIdentifier: "temp", encryptionKey: key as Data, schemaVersion: 2,
                                   migrationBlock: { _, _ in }, objectTypes: [UserState.self, Exposure.self])
      } else {
        return Realm.Configuration(encryptionKey: key as Data, schemaVersion: 2,
                                   migrationBlock: { _, _ in }, objectTypes: [UserState.self, Exposure.self])
      }
    } else {
      return nil
    }
  }

  func getUserState(_ completion: ((UserState) -> Void)) {
    let realm = try! Realm(configuration: realmConfig)
    let userState = realm.object(ofType: UserState.self, forPrimaryKey: 0)
    completion(userState ?? UserState())
  }

  func setUserValue<Value: Codable>(value: Value, keyPath: String, notificationName: Notification.Name) {
      let realm = try! Realm(configuration: realmConfig)
      try! realm.write {
        realm.create(UserState.self, value: [keyPath: value], update: .modified)
        let encodedValue = try JSONEncoder().encode(value)
        let stringRepresentation = String(data: encodedValue, encoding: .utf8)!
        NotificationCenter.default.post(name: notificationName, object: stringRepresentation)
    }
  }

  func resetUserState(_ completion: ((UserState) -> Void)) {
    guard let realmConfig = getRealmConfig() else {
      return
    }
    let realm = try! Realm(configuration: realmConfig)
    try! realm.write {
      let userState = UserState()
      realm.add(userState, update: .modified)
      completion(userState)
    }
  }

  @Persisted(keyPath: .keyPathExposures, notificationName: .ExposuresDidChange, defaultValue: List<Exposure>())
  var exposures: List<Exposure>

  @Persisted(keyPath: .keyPathDateLastPerformedExposureDetection,
             notificationName: .DateLastPerformedExposureDetectionDidChange, defaultValue: nil)
  var dateLastPerformedExposureDetection: Date?

  @Persisted(keyPath: .keyPathExposureDetectionErrorLocalizedDescription, notificationName:
    .StorageExposureDetectionErrorLocalizedDescriptionDidChange, defaultValue: .default)
  var exposureDetectionErrorLocalizedDescription: String

}
