//
//  LocationTests.swift
//  COVIDSafePathsTests
//
//  Created by Tyler Roach on 5/11/20.
//  Copyright © 2020 Path Check Inc. All rights reserved.
//
import XCTest
import RealmSwift
@testable import COVIDSafePaths

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
  
  func testImportParsing() {
    let mockImport: NSDictionary = [
      "time": "1234567",
      "latitude": 12.4213,
      "longitude": 52.123123
    ]
    
    let parsedLocation = Location.fromImportLocation(dictionary: mockImport, source: 1)
    let expectedLocation = Location()
    expectedLocation.latitude = 12.4213
    expectedLocation.longitude = 52.123123
    expectedLocation.time = 1234
    expectedLocation.source = 1
    XCTAssertEqual(expectedLocation.latitude, parsedLocation?.latitude)
    XCTAssertEqual(expectedLocation.longitude, parsedLocation?.longitude)
    XCTAssertEqual(expectedLocation.time, parsedLocation?.time)
    XCTAssertEqual(expectedLocation.source, parsedLocation?.source)
  }
  
  func testSaveParsing() {
    let mockSave: NSDictionary = [
      "time": "1234567",
      "latitude": 12.4213,
      "longitude": 52.123123,
      "hashes": [
        "87e916850d4def3c",
        "87e916850d4def3d",
        "87e916850d4def3e",
        "87e916850d4def3f",
      ],
      "altitude": 423.2321
    ]
    
    let hashList = List<String>()
    hashList.append(objectsIn: [
      "87e916850d4def3c",
      "87e916850d4def3d",
      "87e916850d4def3e",
      "87e916850d4def3f",
    ])
    
    let parsedLocation = Location.parse(dictionary: mockSave, source: 1)
    let expectedLocation = Location()
    expectedLocation.latitude = 12.4213
    expectedLocation.longitude = 52.123123
    expectedLocation.time = 1234567
    expectedLocation.source = 1
    expectedLocation.hashes = hashList
    expectedLocation.altitude.value = 423.2321
    
    XCTAssertEqual(expectedLocation.latitude, parsedLocation?.latitude)
    XCTAssertEqual(expectedLocation.longitude, parsedLocation?.longitude)
    XCTAssertEqual(expectedLocation.time, parsedLocation?.time)
    XCTAssertEqual(expectedLocation.source, parsedLocation?.source)
    XCTAssertEqual(expectedLocation.accuracy.value, parsedLocation?.accuracy.value)
    XCTAssertEqual(expectedLocation.altitude.value, parsedLocation?.altitude.value)
    for hash in expectedLocation.hashes {
      XCTAssertTrue(parsedLocation!.hashes.contains(hash))
    }
  }
}
