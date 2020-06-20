import Foundation
import RealmSwift

final class GPSSecureStorage: SafePathsSecureStorage {

  private static let DAYS_TO_KEEP = 14
  static let LOCATION_INTERVAL = 60 * 5
  private static let MINIMUM_TIME_INTERVAL = 60 * 4
  private static let MAX_BACKFILL_TIME = 60 * 60 * 24

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
    if (currentTime - lastSavedTime < GPSSecureStorage.MINIMUM_TIME_INTERVAL) {
      return
    } else {
      UserDefaults.standard.set(currentTime, forKey: keyLastSavedTime)
    }
    
    let state = UIApplication.shared.applicationState
    // Check whether the app in background | inactive state or not
    if state == .background || state == .inactive {
      saveLocationsInbackground(newlocation: backgroundLocation)
    }

    guard let realmConfig = getRealmConfig() else { return }
    let realm = try! Realm(configuration: realmConfig)

    // Get our Realm file's parent directory
    let folderPath = realm.configuration.fileURL!.deletingLastPathComponent().path

    // Disable file protection for this directory
    try! FileManager.default.setAttributes([FileAttributeKey.protectionKey: FileProtectionType.none], ofItemAtPath: folderPath)

    let realmResults = realm.objects(Location.self)
      .filter("\(Location.KEY_SOURCE)=\(Location.SOURCE_DEVICE)")
      .sorted(byKeyPath: Location.KEY_TIME, ascending: false)
    let previousLocation = realmResults.first
    let previousTime = previousLocation?.time ?? 0
    if currentTime - previousTime > GPSSecureStorage.MINIMUM_TIME_INTERVAL {
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
    
    // Get our Realm file's parent directory
    let folderPath = realm.configuration.fileURL!.deletingLastPathComponent().path

    // Disable file protection for this directory
    try! FileManager.default.setAttributes([FileAttributeKey.protectionKey: FileProtectionType.none], ofItemAtPath: folderPath)
    
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
    
    // Get our Realm file's parent directory
    let folderPath = realm.configuration.fileURL!.deletingLastPathComponent().path

    // Disable file protection for this directory
    try! FileManager.default.setAttributes([FileAttributeKey.protectionKey: FileProtectionType.none], ofItemAtPath: folderPath)
    
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
    
    // Get our Realm file's parent directory
    let folderPath = realm.configuration.fileURL!.deletingLastPathComponent().path

    // Disable file protection for this directory
    try! FileManager.default.setAttributes([FileAttributeKey.protectionKey: FileProtectionType.none], ofItemAtPath: folderPath)
    
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
    let isTimeWithinThreshold = newLocationTime - previousLocation.time <= GPSSecureStorage.MAX_BACKFILL_TIME
    if isNearbyPrevious && isTimeWithinThreshold {
      let latestDesiredBackfill = newLocationTime - GPSSecureStorage.LOCATION_INTERVAL
      let earliestDesiredBackfill = max(newLocationTime - GPSSecureStorage.MAX_BACKFILL_TIME, previousLocation.time + GPSSecureStorage.LOCATION_INTERVAL)
      for time in stride(from: latestDesiredBackfill, through: earliestDesiredBackfill, by: -GPSSecureStorage.LOCATION_INTERVAL) {
        assumedLocationsToInsert.append(Location.createAssumedLocation(time: time, latitude: previousLocation.latitude, longitude: previousLocation.longitude))
      }
    }
    return assumedLocationsToInsert
  }

  override func getRealmConfig() -> Realm.Configuration? {
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

  func getCutoffTime() -> Int {
    return Int(Date().timeIntervalSince1970) - (GPSSecureStorage.DAYS_TO_KEEP * 86400)
  }
  
  func saveLocationsInbackground(newlocation: MAURLocation) {
    
    let locationDict:NSDictionary = newlocation.toDictionary()! as NSDictionary
    let userDefaults = UserDefaults.standard
    var locationList: [NSDictionary]
    
    if let newLocationsList = userDefaults.array(forKey: keyBackgroundNewLocations) as? [NSDictionary] {
      locationList = newLocationsList
      locationList.append(locationDict)
      
    } else {
      locationList = [NSDictionary]()
      locationList.append(locationDict)
    }
    
    userDefaults.set(locationList, forKey: keyBackgroundNewLocations)
  }

}
