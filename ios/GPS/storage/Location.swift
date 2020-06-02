//
//  Location.swift
//  COVIDSafePaths
//
//  Created by Tyler Roach on 4/23/20.
//  Copyright © 2020 Path Check Inc. All rights reserved.
//

import Foundation
import RealmSwift

@objcMembers
class Location: Object {
  static let KEY_TIME = "time"
  static let KEY_LATITUDE = "latitude"
  static let KEY_LONGITUDE = "longitude"
  static let KEY_SOURCE = "source"
  static let KEY_HASHES = "hashes"
  
  static let SOURCE_DEVICE = 0
  static let SOURCE_MIGRATION = 1
  static let SOURCE_GOOGLE = 2
  static let SOURCE_ASSUMED = 3

  // Store date as Int primary key to prevent duplicates. Loses millisecond precision
  dynamic var time: Int = 0
  dynamic var latitude: Double = 0
  dynamic var longitude: Double = 0
  dynamic var source: Int = -1
  dynamic var provider: String?
  var hashes = List<String>()
  let altitude = RealmOptional<Double>()
  let speed = RealmOptional<Float>()
  let accuracy = RealmOptional<Float>()
  let altitudeAccuracy = RealmOptional<Float>()
  let bearing = RealmOptional<Float>()
  
  override static func primaryKey() -> String? {
      return KEY_TIME
  }
  
  func toSharableDictionary() -> [String : Any] {
    return [
      Location.KEY_TIME: time * 1000,
      Location.KEY_LATITUDE: latitude,
      Location.KEY_LONGITUDE: longitude,
      Location.KEY_HASHES: Array(hashes)
    ]
  }
  
  static func fromBackgroundLocation(backgroundLocation: MAURLocation) -> Location {
    let location = Location()
    location.time = Int(backgroundLocation.time.timeIntervalSince1970)
    location.latitude = backgroundLocation.latitude.doubleValue
    location.longitude = backgroundLocation.longitude.doubleValue
    location.altitude.value = backgroundLocation.altitude?.doubleValue
    location.speed.value = backgroundLocation.speed?.floatValue
    location.accuracy.value = backgroundLocation.accuracy?.floatValue
    location.altitudeAccuracy.value = backgroundLocation.altitudeAccuracy?.floatValue
    location.bearing.value = backgroundLocation.heading?.floatValue
    location.source = SOURCE_DEVICE
    location.hashes.append(objectsIn: backgroundLocation.scryptHashes)
    return location;
  }
  
  static func fromImportLocation(dictionary: NSDictionary?, source: Int) -> Location? {
    guard let dictionary  = dictionary else { return nil }

    var parsedTime: Int?
    switch dictionary[KEY_TIME] {
    case let stringTime as String:
      if let doubleTime = Double(stringTime) {
        parsedTime = Int(TimeInterval(doubleTime) / 1000)
      }
    case let doubleTime as Double:
      parsedTime = Int(TimeInterval(doubleTime) / 1000)
    default:
      break
    }

    let parsedLatitude = dictionary[KEY_LATITUDE] as? Double
    let parsedLongitude = dictionary[KEY_LONGITUDE] as? Double

    if let time = parsedTime, let latitude = parsedLatitude, let longitude = parsedLongitude {
      if (latitude == 0.0 || longitude == 0.0) { return nil }

      let location = Location()
      location.time = time
      location.latitude = latitude
      location.longitude = longitude
      location.source = source
      return location
    } else {
      return nil
    }
  }
  
  static func createAssumedLocation(time: Int, latitude: Double, longitude: Double) -> Location {
    let location = Location()
    location.time = time
    location.latitude = latitude
    location.longitude = longitude
    location.source = SOURCE_ASSUMED
    return location
  }
  
  static func areLocationsNearby(lat1: Double, lon1: Double, lat2: Double, lon2: Double) -> Bool {
    let nearbyDistance = 20.0 // in meters, anything closer is "nearby"

    // these numbers from https://en.wikipedia.org/wiki/Decimal_degrees
    let notNearbyInLatitude = 0.00017966 // = nearbyDistance / 111320
    let notNearbyInLongitude23Lat = 0.00019518 // = nearbyDistance / 102470
    let notNearbyInLongitude45Lat = 0.0002541 // = nearbyDistance / 78710
    let notNearbyInLongitude67Lat = 0.00045981 // = nearbyDistance / 43496

    let deltaLon = lon2 - lon1

    // Initial checks we can do quickly.  The idea is to filter out any cases where the
    //   difference in latitude or the difference in longitude must be larger than the
    //   nearby distance, since this can be calculated trivially.
    if (abs(lat2 - lat1) > notNearbyInLatitude) { return false }
    if (abs(lat1) < 23) {
      if (abs(deltaLon) > notNearbyInLongitude23Lat) { return false }
    } else if (abs(lat1) < 45) {
      if (abs(deltaLon) > notNearbyInLongitude45Lat) { return false }
    } else if (abs(lat1) < 67) {
      if (abs(deltaLon) > notNearbyInLongitude67Lat) { return false }
    }

    // Close enough to do a detailed calculation.  Using the the Spherical Law of Cosines method.
    //    https://www.movable-type.co.uk/scripts/latlong.html
    //    https://en.wikipedia.org/wiki/Spherical_law_of_cosines
    //
    // Calculates the distance in meters
    let p1 = (lat1 * .pi) / 180
    let p2 = (lat2 * .pi) / 180
    let deltaLambda = (deltaLon * .pi) / 180
    let R = 6371e3; // gives d in metres
    let d =
      acos(
          sin(p1) * sin(p2) +
              cos(p1) * cos(p2) * cos(deltaLambda)
      ) * R

    // closer than the "nearby" distance?
    if (d < nearbyDistance) { return true }

    // nope
    return false
  }
}
