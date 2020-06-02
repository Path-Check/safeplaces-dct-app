//
//  RealmSecureStorage.swift
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

class RealmSecureStorage {
  
  private static let DAYS_TO_KEEP = 14
  static let LOCATION_INTERVAL = 60 * 5
  private static let MINIMUM_TIME_INTERVAL = 60 * 4
  private static let MAX_BACKFILL_TIME = 60 * 60 * 24
  
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
    
    let realmResults = realm.objects(Location.self)
      .filter("\(Location.KEY_SOURCE)=\(Location.SOURCE_DEVICE)")
      .sorted(byKeyPath: Location.KEY_TIME, ascending: false)
    let previousLocation = realmResults.first
    let previousTime = previousLocation?.time ?? 0
    if currentTime - previousTime > RealmSecureStorage.MINIMUM_TIME_INTERVAL {
      let assumedLocations = createAssumedLocations(previousLocation: previousLocation, newLocation: backgroundLocation)
      try! realm.write {
        realm.add(assumedLocations, update: .modified)
      }
    }
    
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
  
  func createAssumedLocations(previousLocation: Location?, newLocation: MAURLocation) -> [Location] {
    var assumedLocationsToInsert: [Location] = []
    guard let previousLocation = previousLocation else {
      return assumedLocationsToInsert
    }
    
    let newLocationTime = Int(newLocation.time.timeIntervalSince1970)
    let isNearbyPrevious = Location.areLocationsNearby(
      lat1: previousLocation.latitude,
      lon1: previousLocation.longitude,
      lat2: newLocation.latitude.doubleValue,
      lon2: newLocation.longitude.doubleValue)
    let isTimeWithinThreshold = newLocationTime - previousLocation.time <= RealmSecureStorage.MAX_BACKFILL_TIME
    if isNearbyPrevious && isTimeWithinThreshold {
      let latestDesiredBackfill = newLocationTime - RealmSecureStorage.LOCATION_INTERVAL
      let earliestDesiredBackfill = max(newLocationTime - RealmSecureStorage.MAX_BACKFILL_TIME, previousLocation.time + RealmSecureStorage.LOCATION_INTERVAL)
      for time in stride(from: latestDesiredBackfill, through: earliestDesiredBackfill, by: -RealmSecureStorage.LOCATION_INTERVAL) {
        assumedLocationsToInsert.append(Location.createAssumedLocation(time: time, latitude: previousLocation.latitude, longitude: previousLocation.longitude))
      }
    }
    return assumedLocationsToInsert
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
        return Realm.Configuration(inMemoryIdentifier: "temp", encryptionKey: key as Data, schemaVersion: 1,
                                   migrationBlock: { _, _ in }, objectTypes: [Location.self])
      } else {
        return Realm.Configuration(encryptionKey: key as Data, schemaVersion: 1,
                                  migrationBlock: { _, _ in }, objectTypes: [Location.self])
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
