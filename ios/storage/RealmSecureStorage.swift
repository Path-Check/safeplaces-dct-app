//
//  RealmSecureStorage.swift
//  COVIDSafePaths
//
//  Created by Tyler Roach on 5/5/20.
//  Copyright © 2020 Path Check Inc. All rights reserved.
//

import Foundation
import RealmSwift

class RealmSecureStorage {
  
  private static let MINIMUM_TIME_INTERVAL = 60 * 4
  private static let DAYS_TO_KEEP = 14
  
  let keyLastSavedTime: String
  private let inMemory: Bool
  
  init(inMemory: Bool = false) {
    self.inMemory = inMemory
    if (inMemory) {
      self.keyLastSavedTime = "lastSavedTimeInMemory"
    } else {
      self.keyLastSavedTime = "lastSavedTime"
    }
  }
  
  func saveDeviceLocation(backgroundLocation: MAURLocation) {
    // The geolocation library sometimes returns nil times.
    // Almost immediately after these locations, we receive an identical location containing a time.
    guard backgroundLocation.time != nil else {
      return
    }
    
    // Check to only insert location if > minimum time interval
    // Using UserDefaults here since realm reads are async and we could end up saving multiple locations before a query for the most recent record returns
    let currentTime = Int(backgroundLocation.time.timeIntervalSince1970)
    let lastSavedTime = UserDefaults.standard.integer(forKey: keyLastSavedTime)
    if (currentTime - lastSavedTime < RealmSecureStorage.MINIMUM_TIME_INTERVAL) {
      return
    } else {
      UserDefaults.standard.set(currentTime, forKey: keyLastSavedTime)
    }
    
    guard let realmConfig = getRealmConfig() else { return }
    let realm = try! Realm(configuration: realmConfig)
    let location = Location.fromBackgroundLocation(backgroundLocation: backgroundLocation)
    try! realm.write {
      realm.add(location, update: .modified)
    }
  }
  
  func importLocations(locations: NSArray, source: Int, resolve: @escaping RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
    guard let realmConfig = getRealmConfig() else {
      resolve(false)
      return
    }
    let realm = try! Realm(configuration: realmConfig)
    let locationsToInsert = locations.compactMap {
      Location.fromImportLocation(dictionary: $0 as? NSDictionary, source: source)
    }.filter { $0.time >= getCutoffTime()}
    try! realm.write {
      realm.add(locationsToInsert, update: .modified)
    }
    resolve(true)
  }
  
  func getLocations(resolve: @escaping RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
    guard let realmConfig = getRealmConfig() else {
      resolve(NSArray())
      return
    }
    let realm = try! Realm(configuration: realmConfig)
    let realmResults = realm.objects(Location.self)
      .filter("\(Location.KEY_TIME)>=\(getCutoffTime())")
      .sorted(byKeyPath: Location.KEY_TIME, ascending: true)
    let shortenedLocations = Array(realmResults.map { $0.toSharableDictionary() })
    resolve(shortenedLocations)
  }
  
  func trimLocations() {
    guard let realmConfig = getRealmConfig() else {
      return
    }
    let realm = try! Realm(configuration: realmConfig)
    let realmResults = realm.objects(Location.self)
      .filter("\(Location.KEY_TIME)<\(getCutoffTime())")
    try! realm.write {
      realm.delete(realmResults)
    }
  }
  
  func getCutoffTime() -> Int {
    return Int(Date().timeIntervalSince1970) - (RealmSecureStorage.DAYS_TO_KEEP * 86400)
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
    if let key = getEncyrptionKey() {
      if (inMemory) {
        return Realm.Configuration(inMemoryIdentifier: "temp", encryptionKey: key as Data, objectTypes: [Location.self])
      } else {
        return Realm.Configuration(encryptionKey: key as Data, objectTypes: [Location.self])
      }
    } else {
      return nil
    }
  }
  
  func getRealmInstance() -> Realm? {
    guard let config = getRealmConfig() else {
      return nil
    }
    
    return try! Realm(configuration: config)
  }
}
