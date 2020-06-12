import ExposureNotification
import Foundation
import RealmSwift

final class BTSecureStorage: SafePathsSecureStorage {

  static let shared = BTSecureStorage()

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

  @Persisted(keyPath: .keyPathNextDiagnosisKeyFileIndex, notificationName: .NextDiagnosisKeyFileIndexDidChange, defaultValue: 0)
  var nextDiagnosisKeyFileIndex: Int

  @Persisted(keyPath: .keyPathExposures, notificationName: .ExposuresDidChange, defaultValue: List<Exposure>())
  var exposures: List<Exposure>

  @Persisted(keyPath: .keyPathDateLastPerformedExposureDetection,
             notificationName: .DateLastPerformedExposureDetectionDidChange, defaultValue: nil)
  var dateLastPerformedExposureDetection: Date?

  @Persisted(keyPath: .keyPathExposureDetectionErrorLocalizedDescription, notificationName:
    .StorageExposureDetectionErrorLocalizedDescriptionDidChange, defaultValue: .default)
  var exposureDetectionErrorLocalizedDescription: String

  @Persisted(keyPath: .keyPathTestResults, notificationName: .StorageTestResultsDidChange, defaultValue: List<TestResult>())
  var testResults: List<TestResult>

}
