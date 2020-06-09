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

class SafePathsSecureStorage {
  
  let keyLastSavedTime: String
  let inMemory: Bool
  
  init(inMemory: Bool = false) {
    self.inMemory = inMemory
    if (inMemory) {
      self.keyLastSavedTime = "lastSavedTimeInMemory"
    } else {
      self.keyLastSavedTime = "lastSavedTime"
    }
  }
  
  func getEncyrptionKey() -> NSData? {
    // Identifier for our keychain entry - should be unique for your application
    let keychainIdentifier = "org.pathcheck.covid-safepaths.realm"
    let keychainIdentifierData = keychainIdentifier.data(using: String.Encoding.utf8, allowLossyConversion: false)!
    
    // First check in the keychain for an existing key
    var query: [NSString: AnyObject] = [
      kSecClass: kSecClassKey,
      kSecAttrApplicationTag: keychainIdentifierData as AnyObject,
      kSecAttrKeySizeInBits: 512 as AnyObject,
      kSecReturnData: true as AnyObject
    ]
    
    // To avoid Swift optimization bug, should use withUnsafeMutablePointer() function to retrieve the keychain item
    // See also: http://stackoverflow.com/questions/24145838/querying-ios-keychain-using-swift/27721328#27721328
    var dataTypeRef: AnyObject?
    var status = withUnsafeMutablePointer(to: &dataTypeRef) { SecItemCopyMatching(query as CFDictionary, UnsafeMutablePointer($0)) }
    if status == errSecSuccess {
      return dataTypeRef as? NSData
    }
    
    // No pre-existing key from this application, so generate a new one
    let keyData = NSMutableData(length: 64)!
    let result = SecRandomCopyBytes(kSecRandomDefault, 64, keyData.mutableBytes.bindMemory(to: UInt8.self, capacity: 64))
    assert(result == 0, "Failed to get random bytes")
    if (result != 0) {
      return nil
    }
    
    // Store the key in the keychain
    query = [
      kSecClass: kSecClassKey,
      kSecAttrApplicationTag: keychainIdentifierData as AnyObject,
      kSecAttrKeySizeInBits: 512 as AnyObject,
      kSecValueData: keyData
    ]
    
    status = SecItemAdd(query as CFDictionary, nil)
    assert(status == errSecSuccess, "Failed to insert the new key in the keychain")
    if (status != errSecSuccess) {
      return nil
    }
    return keyData
  }
  
  func getRealmConfig() -> Realm.Configuration? {
    preconditionFailure("Subclasses must override \(#function)")
    return nil
  }
  
  func getRealmInstance() -> Realm? {
    guard let config = getRealmConfig() else {
      return nil
    }
    
    return try! Realm(configuration: config)
  }
}
