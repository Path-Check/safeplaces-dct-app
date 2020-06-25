//
//  SafePathsSecureStorage.swift
//  COVIDSafePaths
//
//  Created by Tyler Roach on 5/5/20.
//  Copyright © 2020 Path Check Inc. All rights reserved.
//
// For testing purposes you may need to retrieve data from this encrypted Relm.io database
// Directions on how to export the encryption key and use it to open the database file:
// https://pathcheck.atlassian.net/wiki/spaces/TEST/pages/50824879/Secure+Storage+Testing
// -or-
// https://gist.github.com/troach-sf/f257bb7b80e6dddd4f3bade81b7b1410

import Foundation
import RealmSwift

class SafePathsSecureStorage: NSObject {
  
  let inMemory: Bool
  
  init(inMemory: Bool = false) {
    self.inMemory = inMemory
  }

  var keychainIdentifier: String {
    "org.pathcheck.covid-safepaths.realm"
  }

  private lazy var keychainTag = keychainIdentifier.data(using: String.Encoding.utf8, allowLossyConversion: false)!
  private lazy var keychainAccessControl = SecAccessControlCreateWithFlags(nil, kSecAttrAccessibleAfterFirstUnlock, [], nil)!

  private lazy var keychainQuery: [CFString: Any] = [
    kSecClass: kSecClassKey,
    kSecAttrApplicationTag: keychainTag,
    kSecAttrKeySizeInBits: 512,
    kSecReturnData: true,
    kSecMatchLimit: kSecMatchLimitOne,
  ]

  private lazy var keychainUpdateQuery: [CFString: Any] = [
    kSecClass: kSecClassKey,
    kSecAttrApplicationTag: keychainTag,
    kSecAttrKeySizeInBits: 512,
  ]
  
  final func getEncryptionKey() -> NSData? {
    // First check in the keychain for an existing key
    // To avoid Swift optimization bug, should use withUnsafeMutablePointer() function to retrieve the keychain item
    // See also: http://stackoverflow.com/questions/24145838/querying-ios-keychain-using-swift/27721328#27721328
    var keychainData: CFTypeRef?
    var status = withUnsafeMutablePointer(to: &keychainData) {
      SecItemCopyMatching(keychainQuery as CFDictionary, UnsafeMutablePointer($0))
    }

    if status == errSecSuccess, let keychainData = keychainData as? NSData {
      // For backwards compatibility, ensure existing items have the correct access control
      status = SecItemUpdate(keychainUpdateQuery as CFDictionary, [
        kSecAttrAccessControl: keychainAccessControl,
      ] as CFDictionary)
      assert(status == errSecSuccess, "Failed to set access control")

      return keychainData
    }
    
    // No pre-existing key from this application, so generate a new one
    let keyData = NSMutableData(length: 64)!
    status = SecRandomCopyBytes(kSecRandomDefault, 64, keyData.mutableBytes.bindMemory(to: UInt8.self, capacity: 64))

    guard status == errSecSuccess else {
      assertionFailure("Failed to get random bytes")
      return nil
    }
    
    // Store the key in the keychain
    let query: [CFString: Any] = [
      kSecClass: kSecClassKey,
      kSecAttrApplicationTag: keychainTag,
      kSecAttrAccessControl: keychainAccessControl,
      kSecAttrKeySizeInBits: 512 as AnyObject,
      kSecValueData: keyData,
    ]
    
    status = SecItemAdd(query as CFDictionary, nil)

    guard status == errSecSuccess else {
      assertionFailure("Failed to insert the new key in the keychain")
      return nil
    }

    return keyData
  }
  
  func getRealmConfig() -> Realm.Configuration? {
    preconditionFailure("Subclasses must override \(#function)")
  }
  
  func getRealmInstance() -> Realm? {
    return try? getRealmConfig().flatMap(Realm.init)
  }

}
