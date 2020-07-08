import Foundation
import RealmSwift

final class GPSSecureStorage: SafePathsSecureStorage {

  @objc static let shared = GPSSecureStorage()

  static let DAYS_TO_KEEP: TimeInterval = 14
  static let LOCATION_INTERVAL: TimeInterval = 60 * 5
  static let MAX_BACKFILL_TIME: TimeInterval = 12 * 60 * 60

  private let queue = DispatchQueue(label: "GPSSecureStorage")

  /// Creates stationary locations at `previousLocation` ever `LOCATION_INTERVAL` until `newLocation`.
  /// Returns locations in descending chronological order.
  static func createAssumedLocations(previousLocation: Location, newLocation: MAURLocation) -> [Location] {
    var assumedLocations = [Location]()

    let isNearbyPrevious = Location.areLocationsNearby(
      lat1: previousLocation.latitude,
      lon1: previousLocation.longitude,
      lat2: newLocation.latitude.doubleValue,
      lon2: newLocation.longitude.doubleValue
    )

    if isNearbyPrevious {
      let earliestTime = previousLocation.time + LOCATION_INTERVAL
      let latestTime = min(previousLocation.time + MAX_BACKFILL_TIME, newLocation.time.timeIntervalSince1970)

      assumedLocations.append(contentsOf: stride(
        from: earliestTime, to: latestTime, by: LOCATION_INTERVAL
      ).map {
        Location.fromAssumed(
          time: $0,
          latitude: previousLocation.latitude,
          longitude: previousLocation.longitude
        )
      }.reversed())
    }

    return assumedLocations
  }

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

  override func getRealmConfig() -> Realm.Configuration? {
    // TODO: Create appropriate migration blocks as needed
    if let key = getEncryptionKey() {
      if inMemory {
        return Realm.Configuration(
          inMemoryIdentifier: identifier,
          encryptionKey: key as Data,
          schemaVersion: 1,
          deleteRealmIfMigrationNeeded: true,
          objectTypes: [Location.self]
        )
      } else {
        return Realm.Configuration(
          encryptionKey: key as Data,
          schemaVersion: 1,
          deleteRealmIfMigrationNeeded: true,
          objectTypes: [Location.self]
        )
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

  var cutoffTime: TimeInterval {
    return (Date().timeIntervalSince1970 - (GPSSecureStorage.DAYS_TO_KEEP * 86400))
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

    let currentLocation = Location.fromBackgroundLocation(backgroundLocation: backgroundLocation, source: .device)
    var previousLocations = Array(realm.previousLocations.prefix(2))

    var newLocations = [Location]()

    // Backfill locations if outside the desired interval
    if let previousLocation = previousLocations.first {
      let assumedLocations = GPSSecureStorage.createAssumedLocations(
        previousLocation: previousLocation,
        newLocation: backgroundLocation
      )

      if assumedLocations.count > 0 {
        Log.storage.debug("Backfilling \(assumedLocations.count) locations")
        newLocations.append(contentsOf: assumedLocations)
      }

      previousLocations = assumedLocations + previousLocations
    }

    // If within the minimum time interval, update the existing location
    if previousLocations.count >= 2 && previousLocations[0].time - previousLocations[1].time < GPSSecureStorage.LOCATION_INTERVAL {
      Log.storage.debug("Within minimum interval, updating previous location")
      currentLocation.id = previousLocations[0].id
    }

    newLocations.insert(currentLocation, at: 0)

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
      resolve: { _ in
        realm.backfillLocations(resolve: resolve, reject: reject)
      },
      reject: reject
    )
  }

}

private extension Realm {

  var previousLocations: Results<Location> {
    return objects(Location.self).sorted(byKeyPath: Location.Key.time.rawValue, ascending: false)
  }

  /// Backfills locations if necessary. `resolve` and `reject` will be invoked on the same thread before returning.
  func backfillLocations(resolve: RCTPromiseResolveBlock? = nil, reject: RCTPromiseRejectBlock? = nil) {
    guard let previousLocation = previousLocations.first else {
      resolve?(true)
      return
    }

    let now = Date()

    guard now.timeIntervalSince(previousLocation.date) > GPSSecureStorage.LOCATION_INTERVAL else {
      resolve?(true)
      return
    }

    let currentLocation = MAURLocation(location: previousLocation)
    currentLocation.time = now

    let assumedLocations = GPSSecureStorage.createAssumedLocations(
      previousLocation: previousLocation,
      newLocation: currentLocation
    )

    if assumedLocations.count > 0 {
      Log.storage.debug("Backfilling \(assumedLocations.count) locations")
    }

    write(locations: assumedLocations, resolve: resolve, reject: reject)
  }

  /// Inserts the given locations. `resolve` and `reject` will be invoked on the same thread before returning.
  func write<T: Collection>(locations: T, resolve: RCTPromiseResolveBlock? = nil, reject: RCTPromiseRejectBlock? = nil) where T.Element == Location {
    guard !locations.isEmpty else {
      resolve?(true)
      return
    }
    do {
      try write {
        add(locations, update: .modified)

        Log.storage.debug("Wrote \(locations.count) locations to Realm")
        Log.storage.debug("There are now \(previousLocations.count) locations in Realm")
        resolve?(true)
      }
    }
    catch (let error as NSError) {
      Log.storage.error("Failed to write \(locations.count) locations: \(error)")
      reject?(String(error.code), error.localizedFailureReason ?? error.localizedDescription, error)
    }
  }

  /// Deletes the given locations. `resolve` and `reject` will be invoked on the same thread before returning.
  func delete<T: Collection>(locations: T, resolve: RCTPromiseResolveBlock? = nil, reject: RCTPromiseRejectBlock? = nil) where T.Element == Location {
    guard !locations.isEmpty else {
      resolve?(true)
      return
    }
    do {
      try write {
        delete(locations)

        Log.storage.debug("Deleted \(locations.count) locations from Realm")
        Log.storage.debug("There are now \(previousLocations.count) locations in Realm")
        resolve?(true)
      }
    }
    catch (let error as NSError) {
      Log.storage.error("Failed to delete \(locations.count) locations: \(error)")
      reject?(String(error.code), error.localizedFailureReason ?? error.localizedDescription, error)
    }
  }

}
