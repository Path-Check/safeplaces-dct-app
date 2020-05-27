//
//  MAURLocation+Extension.swift
//  COVIDSafePaths
//
//  Created by Michael Neas on 5/21/20.
//  Copyright © 2020 Path Check Inc. All rights reserved.
//
import Foundation
// Currently CryptoKit does not support scrypt
import CryptoSwift

public extension MAURLocation {
  func roundToInterval(timestamp: TimeInterval, interval: TimeInterval) -> TimeInterval {
    floor(timestamp / interval) * interval
  }
  
  // The UTC timestamp in seconds of the datapoint, rounded down to the nearest 5 minutes
  var nearestTimeStamp: Int {
    Int((time.timeIntervalSince1970 / 300.0).rounded(.down) * 300)
  }

///  A “cost” of 2^18 (may be customizable by Health Authorities in future - see below).
///  A “maxmem” of (2^18 + 3) * 1024 = ~262MB (see: https://github.com/nodejs/node/issues/21524 )
///  A salt of “” (empty string) (see below for future customization by Health Authorities)
///  A block size of 8
///  A keylen (output) of 16 bytes.
  var scryptHash: String {
    let hash = Array((geohash(precision: 8) + String(nearestTimeStamp)).utf8)
    let generic = Array("salt".utf8)
    return try! Scrypt(password: hash, salt: generic, dkLen: 16, N: 16384, r: 8, p: 1).calculate().toBase64()!
  }
  
  var validHashes: [String] {
    []
  }

  func geohash(precision: Int) -> String {
    Geohash.encode(latitude: latitude.doubleValue, longitude: longitude.doubleValue, length: precision)
  }
}
