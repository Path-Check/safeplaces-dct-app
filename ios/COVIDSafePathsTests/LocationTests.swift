//
//  LocationTests.swift
//  COVIDSafePathsTests
//
//  Created by Tyler Roach on 5/11/20.
//  Copyright © 2020 Path Check Inc. All rights reserved.
//
import XCTest
@testable import GPS

class LocationTests: XCTestCase {
  
  func testNorthAndSouthPolesNotNearby() {
    XCTAssertFalse(Location.areLocationsNearby(lat1: 90.0, lon1: 0.0, lat2: -90.0, lon2: 0.0))
  }

  func testNewYorkAndSydneyNotNearby() {
    XCTAssertFalse(Location.areLocationsNearby(lat1: 40.7128, lon1: -74.006, lat2: -33.8688, lon2: 151.2093))
  }

  func testSpotsInKansasCityAreNearby() {
    XCTAssertTrue(Location.areLocationsNearby(lat1: 39.09772, lon1: -94.582959, lat2: 39.097769, lon2: -94.582937))
  }
}
