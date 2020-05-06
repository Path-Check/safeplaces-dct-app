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
  
  static let SOURCE_DEVICE = 0
  static let SOURCE_MIGRATION = 1
  static let SOURCE_GOOGLE = 2

  // Store date as Int primary key to prevent duplicates. Loses millisecond precision
  dynamic var time: Int = 0
  dynamic var latitude: Double = 0
  dynamic var longitude: Double = 0
  dynamic var source: Int = -1
  dynamic var provider: String?
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
      Location.KEY_LONGITUDE: longitude
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
}
