import ExposureNotification
import Foundation
import RealmSwift

final class BTESecureStorage: SafePathsSecureStorage {
  
  static let shared = BTESecureStorage()
  
  override var keychainIdentifier: String {
    "org.pathcheck.bt.realm"
  }
  
  override func getRealmConfig() -> Realm.Configuration? {
    if let key = getEncyrptionKey() {
      if (inMemory) {
        return Realm.Configuration(inMemoryIdentifier: "temp", encryptionKey: key as Data, schemaVersion: 1,
                                   migrationBlock: { _, _ in }, objectTypes: [UserState.self, Exposure.self, TestResult.self])
      } else {
        return Realm.Configuration(encryptionKey: key as Data, schemaVersion: 1,
                                   migrationBlock: { _, _ in }, objectTypes: [UserState.self, Exposure.self, TestResult.self])
      }
    } else {
      return nil
    }
  }
  
  func getUserState(_ completion: ((UserState) -> Void)) {
    guard let realmConfig = getRealmConfig() else {
      return
    }
    let realm = try! Realm(configuration: realmConfig)
    let userState = realm.objects(UserState.self)
      .filter { $0.id == UserState.id }
    completion(userState.first ?? UserState())
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
  
  @Persisted(keyPath: "nextDiagnosisKeyFileIndex", notificationName: .init("BTESecureStorageNextDiagnosisKeyFileIndexDidChange"), defaultValue: 0)
  var nextDiagnosisKeyFileIndex: Int
  
  @Persisted(keyPath: "exposures", notificationName: .init("BTESecureStorageExposuresDidChange"), defaultValue: List<Exposure>())
  var exposures: List<Exposure>
  
  @Persisted(keyPath: "dateLastPerformedExposureDetection",
             notificationName: .init("BTESecureStorageDateLastPerformedExposureDetectionDidChange"), defaultValue: nil)
  var dateLastPerformedExposureDetection: Date?
  
  @Persisted(keyPath: "exposureDetectionErrorLocalizedDescription", notificationName:
    .init("BTESecureStorageExposureDetectionErrorLocalizedDescriptionDidChange"), defaultValue: .default)
  var exposureDetectionErrorLocalizedDescription: String
  
  @Persisted(keyPath: "testResults", notificationName: .init("BTESecureStorageTestResultsDidChange"), defaultValue: List<TestResult>())
  var testResults: List<TestResult>
  
}
