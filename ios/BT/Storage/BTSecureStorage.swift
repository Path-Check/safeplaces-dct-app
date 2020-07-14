import ExposureNotification
import Foundation
import RealmSwift

final class BTSecureStorage: SafePathsSecureStorage {

  static let shared = BTSecureStorage(inMemory: false)

  override var keychainIdentifier: String {
    "\(Bundle.main.bundleIdentifier!).realm"
  }

  private lazy var realmConfig: Realm.Configuration = {
    guard let realmConfig = getRealmConfig() else {
      fatalError("Missing realm configuration")
    }
    return realmConfig
  }()

  override init(inMemory: Bool = false) {
    super.init(inMemory: inMemory)
    if !userStateExists {
      resetUserState({ _ in })
    }
  }

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

  var userStateExists: Bool {
    let realm = try! Realm(configuration: realmConfig)
    return realm.object(ofType: UserState.self, forPrimaryKey: 0) != nil
  }

  func setUserValue<Value: Codable>(value: Value, keyPath: String, notificationName: Notification.Name) {
      let realm = try! Realm(configuration: realmConfig)
      try! realm.write {
        realm.create(UserState.self, value: [keyPath: value], update: .modified)
        let jsonString = value.jsonStringRepresentation()
        NotificationCenter.default.post(name: notificationName, object: jsonString)
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
      userState.exposures.append(objectsIn: exposures)
      let jsonString = userState.exposures.jsonStringRepresentation()
      NotificationCenter.default.post(name: .ExposuresDidChange, object: jsonString)
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

  @Persisted(keyPath: .keyPathExposureDetectionErrorLocalizedDescription, notificationName:
    .StorageExposureDetectionErrorLocalizedDescriptionDidChange, defaultValue: .default)
  var exposureDetectionErrorLocalizedDescription: String

}
