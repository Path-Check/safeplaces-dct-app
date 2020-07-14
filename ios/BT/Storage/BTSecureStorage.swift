import ExposureNotification
import Foundation
import RealmSwift

final class BTSecureStorage: SafePathsSecureStorage {

  static let shared = BTSecureStorage()

  override var keychainIdentifier: String {
    "\(Bundle.main.bundleIdentifier!).realm"
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
        return Realm.Configuration(inMemoryIdentifier: identifier, encryptionKey: key as Data, schemaVersion: 4,
                                   migrationBlock: { _, _ in }, objectTypes: [UserState.self, Exposure.self])
      } else {
        return Realm.Configuration(encryptionKey: key as Data, schemaVersion: 4,
                                   migrationBlock: { _, _ in }, objectTypes: [UserState.self, Exposure.self])
      }
    } else {
      return nil
    }
  }

  var userState: UserState {
    let realm = try! Realm(configuration: realmConfig)
    return realm.object(ofType: UserState.self, forPrimaryKey: 0) ?? UserState()
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

  func storeExposures(_ exposures: [Exposure]) {
    let realm = try! Realm(configuration: realmConfig)
    try! realm.write {
      exposures.forEach { userState.exposures.append($0) }
    }
  }

  @Persisted(keyPath: .remainingDailyFileProcessingCapacity, notificationName: .remainingDailyFileProcessingCapacityDidChange, defaultValue: Constants.dailyFileProcessingCapacity)
  var remainingDailyFileProcessingCapacity: Int

  @Persisted(keyPath: .urlOfMostRecentlyDetectedKeyFile, notificationName: .UrlOfMostRecentlyDetectedKeyFileDidChange, defaultValue: .default)
  var urlOfMostRecentlyDetectedKeyFile: String

  @Persisted(keyPath: .keyPathExposures, notificationName: .ExposuresDidChange, defaultValue: List<Exposure>())
  var exposures: List<Exposure>

  @Persisted(keyPath: .keyPathdateLastPerformedFileCapacityReset,
             notificationName: .dateLastPerformedFileCapacityResetDidChange, defaultValue: nil)
  var dateLastPerformedFileCapacityReset: Date?

  @Persisted(keyPath: .keyPathHMACKey,
             notificationName: .HMACKeyDidChange, defaultValue: "")
  var HMACKey: String

  @Persisted(keyPath: .keyPathExposureDetectionErrorLocalizedDescription, notificationName:
    .StorageExposureDetectionErrorLocalizedDescriptionDidChange, defaultValue: .default)
  var exposureDetectionErrorLocalizedDescription: String

}
