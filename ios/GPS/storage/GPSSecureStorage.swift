import Foundation
import RealmSwift

final class GPSSecureStorage: SafePathsSecureStorage {

  @objc static let shared = GPSSecureStorage()

  static let DAYS_TO_KEEP = 14
  static let LOCATION_INTERVAL = 60 * 5
  static let MINIMUM_TIME_INTERVAL = 60 * 4
  static let MAX_BACKFILL_TIME = 60 * 60

  private let queue = DispatchQueue(label: "GPSSecureStorage")

  @objc func saveDeviceLocation(_ backgroundLocation: MAURLocation, completion: (() -> Void)? = nil) {
    queue.async {
      autoreleasepool { [weak self] in
        self?.saveDeviceLocationImmediately(backgroundLocation)
        completion?()
      }
    }
  }

  @objc func importLocations(locations: NSArray, source: Location.Source, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    queue.async {
      autoreleasepool { [weak self] in
        self?.importLocationsImmediately(locations, source: source, resolve: resolve, reject: reject)
      }
    }
  }

  @objc func getLocations(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    queue.async {
      autoreleasepool { [weak self] in
        self?.getLocationsImmediately(resolve: resolve, reject: reject)
      }
    }
  }

  @objc func trimLocations(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    queue.async {
      autoreleasepool { [weak self] in
        self?.trimLocationsImmediately(resolve: resolve, reject: reject)
      }
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
        assumedLocationsToInsert.append(Location.fromAssumed(
          time: time,
          latitude: previousLocation.latitude,
          longitude: previousLocation.longitude
        ))
      }
    }

    return assumedLocationsToInsert
  }

  override func getRealmConfig() -> Realm.Configuration? {
    if let key = getEncryptionKey() {
      if inMemory {
        return Realm.Configuration(inMemoryIdentifier: identifier, encryptionKey: key as Data, schemaVersion: 1,
                                   migrationBlock: { _, _ in }, objectTypes: [Location.self])
      } else {
        return Realm.Configuration(encryptionKey: key as Data, schemaVersion: 1,
                                   migrationBlock: { _, _ in }, objectTypes: [Location.self])
      }
    } else {
      return nil
    }
  }

  override func getRealmInstance() -> Realm? {
    guard let realm = super.getRealmInstance() else {
      return nil
    }

    // The OS default file protection level encrypts Realm files when device is locked.
    // We enable Realm's encryption (see getEncryptionKey) instead, so can remove the OS file protection.
    // This allows us to write/read from Realm while the app is backgrounded and the device is locked.
    if let dir = realm.configuration.fileURL?.deletingLastPathComponent().path {
      do {
        try FileManager.default.setAttributes([
          .protectionKey: FileProtectionType.none
        ], ofItemAtPath: dir)
      }
      catch (let error) {
        Log.storage.error("Failed to set Realm file protection level: \(error)")
      }
    }

    return realm
  }

}

// MARK: - Private

private extension GPSSecureStorage {

  var cutoffTime: Int {
    return Int(Date().timeIntervalSince1970) - (GPSSecureStorage.DAYS_TO_KEEP * 86400)
  }

  /// This function should be called only on self.queue
  func saveDeviceLocationImmediately(_ backgroundLocation: MAURLocation) {
    Log.storage.debug("Processing \(backgroundLocation)")

    // The geolocation library sometimes returns nil times.
    // Almost immediately after these locations, we receive an identical location containing a time.
    guard backgroundLocation.hasTime() else {
      return
    }

    guard let realm = getRealmInstance() else {
      return
    }

    let currentTime = Int(backgroundLocation.time.timeIntervalSince1970)

    var newLocations = [Location]()

    // Check if a previous location has been recorded
    if let previousLocation = realm.objects(Location.self)
      .filter("\(Location.Key.source.rawValue)=\(Location.Source.device.rawValue)")
      .sorted(byKeyPath: Location.Key.time.rawValue, ascending: false)
      .first {

      // If within the minimum time interval, discard the new location
      if currentTime - previousLocation.time < GPSSecureStorage.MINIMUM_TIME_INTERVAL {
        Log.storage.debug("Discarding location due to minimum interval")
        return
      }

      // Backfill locations if outside the desired interval
      if currentTime - previousLocation.time > GPSSecureStorage.LOCATION_INTERVAL {
        newLocations = createAssumedLocations(previousLocation: previousLocation, newLocation: backgroundLocation)
      }
    }

    newLocations.append(
      Location.fromBackgroundLocation(backgroundLocation: backgroundLocation, source: .device)
    )

    realm.write(locations: newLocations)
  }

  /// This function should be called only on self.queue
  func importLocationsImmediately(_ locations: NSArray, source: Location.Source, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    guard let realm = getRealmInstance() else {
      resolve(false)
      return
    }

    let locationsToInsert = locations.compactMap {
      Location.fromImportLocation(dictionary: $0 as? NSDictionary, source: source)
    }.filter {
      $0.time >= cutoffTime
    }

    realm.write(locations: locationsToInsert, resolve: resolve, reject: reject)
  }

  /// This function should be called only on self.queue
  func getLocationsImmediately(resolve: @escaping RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
    guard let realm = getRealmInstance() else {
      resolve(NSArray())
      return
    }

    let results = realm.objects(Location.self)
      .filter("\(Location.Key.time.rawValue)>=\(cutoffTime)")
      .sorted(byKeyPath: Location.Key.time.rawValue, ascending: true)

    resolve(Array(results.map { $0.toSharableDictionary() }))
  }

  /// This function should be called only on self.queue
  func trimLocationsImmediately(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    guard let realm = getRealmInstance() else {
      resolve(false)
      return
    }
    realm.delete(
      locations: realm.objects(Location.self).filter("\(Location.Key.time.rawValue)<\(cutoffTime)"),
      resolve: resolve,
      reject: reject
    )
  }

}

private extension Realm {

  func write<T: Collection>(locations: T, resolve: RCTPromiseResolveBlock? = nil, reject: RCTPromiseRejectBlock? = nil) where T.Element == Location {
    guard !locations.isEmpty else {
      resolve?(true)
      return
    }
    do {
      try write {
        add(locations, update: .modified)

        Log.storage.error("Wrote \(locations.count) locations to Realm")
        resolve?(true)
      }
    }
    catch (let error as NSError) {
      Log.storage.error("Failed to write \(locations.count) locations: \(error)")
      reject?(String(error.code), error.localizedFailureReason ?? error.localizedDescription, error)
    }
  }

  func delete<T: Collection>(locations: T, resolve: RCTPromiseResolveBlock? = nil, reject: RCTPromiseRejectBlock? = nil) where T.Element == Location {
    guard !locations.isEmpty else {
      resolve?(true)
      return
    }
    do {
      try write {
        delete(locations)

        Log.storage.error("Deleted \(locations.count) locations from Realm")
        resolve?(true)
      }
    }
    catch (let error as NSError) {
      Log.storage.error("Failed to delete \(locations.count) locations: \(error)")
      reject?(String(error.code), error.localizedFailureReason ?? error.localizedDescription, error)
    }
  }

}
