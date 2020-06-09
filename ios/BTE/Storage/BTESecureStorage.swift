import Foundation
import RealmSwift

final class BTESecureStorage: SafePathsSecureStorage {

  override func getRealmConfig() -> Realm.Configuration? {
    if let key = getEncyrptionKey() {
      if (inMemory) {
        return Realm.Configuration(inMemoryIdentifier: "temp", encryptionKey: key as Data, schemaVersion: 1,
                                   migrationBlock: { _, _ in }, objectTypes: [ExposureKey.self])
      } else {
        return Realm.Configuration(encryptionKey: key as Data, schemaVersion: 1,
                                   migrationBlock: { _, _ in }, objectTypes: [ExposureKey.self])
      }
    } else {
      return nil
    }
  }

  func getCutoffTime() -> Int {
    return Int(Date().timeIntervalSince1970) - (SafePathsSecureStorage.DAYS_TO_KEEP * 86400)
  }

}
