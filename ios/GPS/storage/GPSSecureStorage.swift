import Foundation

final class GPSSecureStorage: SafePathsSecureStorage {

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
    if (currentTime - lastSavedTime < SafePathsSecureStorage.MINIMUM_TIME_INTERVAL) {
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
    if currentTime - previousTime > SafePathsSecureStorage.MINIMUM_TIME_INTERVAL {
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
    let isTimeWithinThreshold = newLocationTime - previousLocation.time <= SafePathsSecureStorage.MAX_BACKFILL_TIME
    if isNearbyPrevious && isTimeWithinThreshold {
      let latestDesiredBackfill = newLocationTime - SafePathsSecureStorage.LOCATION_INTERVAL
      let earliestDesiredBackfill = max(newLocationTime - SafePathsSecureStorage.MAX_BACKFILL_TIME, previousLocation.time + SafePathsSecureStorage.LOCATION_INTERVAL)
      for time in stride(from: latestDesiredBackfill, through: earliestDesiredBackfill, by: -SafePathsSecureStorage.LOCATION_INTERVAL) {
        assumedLocationsToInsert.append(Location.createAssumedLocation(time: time, latitude: previousLocation.latitude, longitude: previousLocation.longitude))
      }
    }
    return assumedLocationsToInsert
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

  func getCutoffTime() -> Int {
    return Int(Date().timeIntervalSince1970) - (SafePathsSecureStorage.DAYS_TO_KEEP * 86400)
  }

}
