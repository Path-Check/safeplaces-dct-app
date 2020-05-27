//
//  GeohashTests.swift
//  GPSTests
//
//  Created by Michael Neas on 5/21/20.
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
      XCTAssertEqual(location.geohash(precision: index + 1), hashes[index])
    }
  }
}
