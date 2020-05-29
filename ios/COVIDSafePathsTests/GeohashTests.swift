//
//  GeohashTests.swift
//  GPSTests
//
//  Created by Michael Neas on 5/28/20.
//  Copyright © 2020 Path Check Inc. All rights reserved.
//


import XCTest

class GeohashTests: XCTestCase {
  func testGeoHash() {
    let location = TestMAURLocation(latitude: 42.360084, longitude: -71.058905, date: Date())
    let hashes = [
      "d",
      "dr",
      "drt",
      "drt2",
      "drt2z",
      "drt2zp",
      "drt2zp2",
      "drt2zp2m",
      "drt2zp2mr"
    ]
    for index in 0..<hashes.count {
      XCTAssertEqual(Geohash.encode(latitude: location.latitude.doubleValue, longitude: location.longitude.doubleValue, length: index + 1), hashes[index])
    }
  }

  func testGeohashSpec() {
    XCTAssertEqual("sr6de7ee", Geohash.encode(latitude: 41.24060321, longitude: 14.91328448, length: 8))
  }
}
