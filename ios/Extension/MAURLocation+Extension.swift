//
//  MAURLocation+Extension.swift
//  COVIDSafePaths
//
//  Created by Michael Neas on 5/21/20.
//  Copyright © 2020 Path Check Inc. All rights reserved.
//
import Foundation
import Scrypt
import os.log

public extension MAURLocation {
  /// Generates rounded time windows for interval before and after timestamp
  /// https://pathcheck.atlassian.net/wiki/x/CoDXB
  /// - Parameters:
  ///   - interval: location storage interval in seconds
  func timeWindows(interval: TimeInterval) -> (early: Int, late: Int) {
    let time1 = Int(((time.timeIntervalSince1970 - interval / 2) / interval).rounded(.down) * interval)
    let time2 = Int(((time.timeIntervalSince1970 + interval / 2) / interval).rounded(.down) * interval)
    return (time1, time2)
  }

  /// Generates array of geohashes concatenated with time, within a 10 meter radius of given location
  var geoHashes: [String] {
    Geohash.GEO_CIRCLE_RADII.map({ radii in
      (latitude.doubleValue + radii.latitude, longitude.doubleValue + radii.longitude)
    }).reduce(into: Set<String>(), { (hashes, currentLocation) in
      hashes.insert(Geohash.encode(latitude: currentLocation.0, longitude: currentLocation.1, length: 8))
    }).reduce(into: [String](), { (hashes, hash) in
      let timeWindow = timeWindows(interval: Double(60 * 5 * 1000))
      hashes.append("\(hash)\(timeWindow.early)")
      hashes.append("\(hash)\(timeWindow.late)")
    })
  }

  /// Encodes geoHashes with the scrypt algorithm
  var scryptHashes: [String] {
    if #available(iOS 10.0, *) {
      let start = DispatchTime.now()
      let scryptGeoHashes = geoHashes.map(scrypt)
      let end = DispatchTime.now()
      let nanoTime = end.uptimeNanoseconds - start.uptimeNanoseconds
      let timeInterval = Double(nanoTime) / 1_000_000_000
      os_log("Hashing completed in: %d seconds", log: Log.scryptHashing, type: .debug, timeInterval)
      return scryptGeoHashes
    } else {
      return geoHashes.map(scrypt)
    }
  }

  /// Apply scrypt hash algorithm on a String
  ///
  /// - Parameters:
  ///     - hash: value to hash
  func scrypt(on hash: String) -> String {
    let hash = Array(hash.utf8)
    let generic = Array("salt".utf8)
    ///  A “cost” (N) that is to be determined.  Initially was 16384, then modified to 4096
    ///  A salt of “salt”
    ///  A block size of 8
    ///  A keylen (output) of 8 bytes = 16 hex digits.
    /// Parallelization (p) of 1 - this is the default.
    return try! Scrypt.scrypt(password: hash, salt: generic, length: 8,N: 4096, r: 8, p: 1).toHexString()
  }
}
