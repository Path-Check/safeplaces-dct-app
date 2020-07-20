//
//  GPSSecureStorageTest.swift
//  COVIDSafePathsTests
//
//  Created by Tyler Roach on 5/5/20.
//  Copyright © 2020 Path Check Inc. All rights reserved.
//

import XCTest
import RealmSwift
@testable import GPS

class GPSSecureStorageTest: XCTestCase {
  
  var secureStorage: GPSSecureStorage?
  var hold: Realm?
  
  override func setUp() {
    super.setUp()
    secureStorage = GPSSecureStorage(inMemory: true)
    hold = secureStorage!.getRealmInstance()
  }
  
  override func tearDown() {
    super.tearDown()
    hold = nil
  }
  
  func testSaveDeviceLocation() {
    // given
    let location1Date = Date()
    let location1Time = location1Date.timeIntervalSince1970
    let backgroundLocation1 = TestMAURLocation(latitude: 40.730610, longitude: -73.935242, date: location1Date)

    let expectation = XCTestExpectation(description: "Save Device Location")

    // when
    secureStorage!.saveDeviceLocation(backgroundLocation1) {
      expectation.fulfill()
    }

    wait(for: [expectation], timeout: 5)

    // then
    guard let resultLocation = querySingleLocationByTime(time: location1Time) else {
      XCTFail("Resulting location returned nil")
      return
    }
    XCTAssertEqual(40.730610, resultLocation.latitude)
    XCTAssertEqual(-73.935242, resultLocation.longitude)
    XCTAssertEqual(location1Time, resultLocation.time)
  }
  
  func testSaveDeviceLocationIfPreviousTooClose() {
    // given
    let location1Date = Date()
    let location1Time = location1Date.timeIntervalSince1970
    let backgroundLocation1 = TestMAURLocation(latitude: 40.730610, longitude: -73.935242, date: location1Date)
    let location2Date = location1Date.addingTimeInterval(1)
    let location2Time = location2Date.timeIntervalSince1970
    let backgroundLocation2 = TestMAURLocation(latitude: 40.730610, longitude: -73.935242, date: location2Date)
    let location3Date = location2Date.addingTimeInterval(4)
    let location3Time = location3Date.timeIntervalSince1970
    let backgroundLocation3 = TestMAURLocation(latitude: 40.730610, longitude: -73.935242, date: location3Date)

    let expect1 = XCTestExpectation(description: "Save Device Location 1")
    let expect2 = XCTestExpectation(description: "Save Device Location 2")
    let expect3 = XCTestExpectation(description: "Save Device Location 3")

    // when
    secureStorage!.saveDeviceLocation(backgroundLocation1) {
      expect1.fulfill()
    }
    secureStorage!.saveDeviceLocation(backgroundLocation2) {
      expect2.fulfill()
    }
    secureStorage!.saveDeviceLocation(backgroundLocation3) {
      expect3.fulfill()
    }

    wait(for: [expect1, expect2, expect3], timeout: 500)
      
    // then
    XCTAssertNotNil(querySingleLocationByTime(time: location1Time))
    XCTAssertNil(querySingleLocationByTime(time: location2Time))
    XCTAssertNotNil(querySingleLocationByTime(time: location3Time))
  }
  
  func testImportSuccessFromGoogle() {
    // given
    let location1TimeDouble = Date().timeIntervalSince1970 * 1000
    let location1Time = location1TimeDouble / 1000
    let location1: [String: Any] = [Location.Key.time.rawValue: location1TimeDouble, Location.Key.latitude.rawValue: 40.730610, Location.Key.longitude.rawValue: -73.935242, Location.Key.hashes.rawValue: ["test1", "test2"]]
    let location2TimeDouble = Date().addingTimeInterval(10).timeIntervalSince1970 * 1000
    let location2TimeString = String(format:"%.0f", location2TimeDouble)
    let location2Time = location2TimeDouble / 1000
    let location2 = [Location.Key.time.rawValue: location2TimeString, Location.Key.latitude.rawValue: 37.773972, Location.Key.longitude.rawValue: -122.431297] as [String : Any]
    let locations = NSArray(array: [location1, location2])

    let expectation = XCTestExpectation(description: "Import Locations")

    // when
    secureStorage!.importLocations(
      locations: locations,
      source: .google,
      resolve: { result in
        XCTAssertEqual(true, result as! Bool)
        expectation.fulfill()
      },
      reject: rejecterFulfilling(expectation: expectation)
    )

    wait(for: [expectation], timeout: 5)
    
    // then
    guard let resultLocation = querySingleLocationByTime(time: location1Time) else {
      XCTFail("Resulting location 1 returned nil")
      return
    }
    XCTAssertEqual(40.730610, resultLocation.latitude)
    XCTAssertEqual(-73.935242, resultLocation.longitude)
    XCTAssertEqual(location1Time, resultLocation.time)
    XCTAssertEqual(Location.Source.google.rawValue, resultLocation.source)
    XCTAssertEqual(2, resultLocation.hashes.count)
    XCTAssertEqual("test1", resultLocation.hashes[0])
    XCTAssertEqual("test2", resultLocation.hashes[1])

    guard let resultLocation2 = querySingleLocationByTime(time: location2Time) else {
      XCTFail("Resulting location 2 returned nil")
      return
    }
    XCTAssertEqual(37.773972, resultLocation2.latitude)
    XCTAssertEqual(-122.431297, resultLocation2.longitude)
    XCTAssertEqual(location2Time, resultLocation2.time, accuracy: 0.01)
    XCTAssertEqual(Location.Source.google.rawValue, resultLocation2.source)
  }
  
  func testImportSuccessFromMigration() {
    // given
    let location1TimeDouble = Date().timeIntervalSince1970 * 1000
    let location1Time = location1TimeDouble / 1000
    let location1 = [Location.Key.time.rawValue: location1TimeDouble, Location.Key.latitude.rawValue: 40.730610, Location.Key.longitude.rawValue: -73.935242]
    let location2TimeDouble = Date().addingTimeInterval(10).timeIntervalSince1970 * 1000
    let location2TimeString = String(format:"%.0f", location2TimeDouble)
    let location2Time = location2TimeDouble / 1000
    let location2 = [Location.Key.time.rawValue: location2TimeString, Location.Key.latitude.rawValue: 37.773972, Location.Key.longitude.rawValue: -122.431297] as [String : Any]
    let locations = NSArray(array: [location1, location2])

    let expectation = XCTestExpectation(description: "Import Locations")

    // when
    secureStorage!.importLocations(
      locations: locations,
      source: .migration,
      resolve: { result in
        XCTAssertEqual(true, result as! Bool)
        expectation.fulfill()
      },
      reject: rejecterFulfilling(expectation: expectation)
    )

    wait(for: [expectation], timeout: 5)
    
    // then
    guard let resultLocation = querySingleLocationByTime(time: location1Time) else {
      XCTFail("Resulting location 1 returned nil")
      return
    }
    XCTAssertEqual(40.730610, resultLocation.latitude)
    XCTAssertEqual(-73.935242, resultLocation.longitude)
    XCTAssertEqual(location1Time, resultLocation.time)
    XCTAssertEqual(Location.Source.migration.rawValue, resultLocation.source)
    guard let resultLocation2 = querySingleLocationByTime(time: location2Time) else {
      XCTFail("Resulting location 2 returned nil")
      return
    }
    XCTAssertEqual(37.773972, resultLocation2.latitude)
    XCTAssertEqual(-122.431297, resultLocation2.longitude)
    XCTAssertEqual(location2Time, resultLocation2.time, accuracy: 0.01)
    XCTAssertEqual(Location.Source.migration.rawValue, resultLocation2.source)
  }
  
  func testImportFailsIfLocationOlderThanMinimum() {
    // given
    let location1TimeDouble = Date().addingTimeInterval(-(GPSSecureStorage.DAYS_TO_KEEP + 1)*24*60*60).timeIntervalSince1970 * 1000
    let location1Time = location1TimeDouble / 1000
    let location1 = [Location.Key.time.rawValue: location1TimeDouble, Location.Key.latitude.rawValue: 40.730610, Location.Key.longitude.rawValue: -73.935242]
    let location2TimeDouble = Date().timeIntervalSince1970 * 1000
    let location2Time = location2TimeDouble / 1000
    let location2 = [Location.Key.time.rawValue: location2TimeDouble, Location.Key.latitude.rawValue: 37.773972, Location.Key.longitude.rawValue: -122.431297]
    let locations = NSArray(array: [location1, location2])

    let expectation = XCTestExpectation(description: "Import Locations")

    // when
    secureStorage!.importLocations(
      locations: locations,
      source: .migration,
      resolve: { result in
        XCTAssertEqual(true, result as! Bool)
        expectation.fulfill()
      },
      reject: rejecterFulfilling(expectation: expectation)
    )

    wait(for: [expectation], timeout: 5)
    
    // then
    XCTAssertNil(querySingleLocationByTime(time: location1Time))
    XCTAssertNotNil(querySingleLocationByTime(time: location2Time))
  }
  
  func testGetLocationsReturnsSortedAndFilters() {
    // given
    let location1Date = Date()
    let location1Time = location1Date.timeIntervalSince1970
    let backgroundLocation1 = TestMAURLocation(latitude: 40.730610, longitude: -73.935242, date: location1Date)
    let location2TimeDouble = Date().addingTimeInterval(-10*24*60*60).timeIntervalSince1970 * 1000
    let location2Time = location2TimeDouble / 1000
    let location2 = [Location.Key.time.rawValue: location2TimeDouble, Location.Key.latitude.rawValue: 37.773972, Location.Key.longitude.rawValue: -122.431297]
    let importLocations = NSArray(array: [location2])

    let expect1 = XCTestExpectation(description: "Save Location")
    let expect2 = XCTestExpectation(description: "Save Location")

    secureStorage!.saveDeviceLocation(backgroundLocation1, backfill: false) {
      expect1.fulfill()
    }

    secureStorage!.importLocations(
      locations: importLocations,
      source: .migration,
      resolve: resolverFulfilling(expectation: expect2),
      reject: rejecterFulfilling(expectation: expect2)
    )

    wait(for: [expect1, expect2], timeout: 5)

    let expect3 = XCTestExpectation(description: "Get Locations")
    
    // when
    secureStorage!.getLocations(resolve: { result in
      XCTAssertEqual(2, (result as! NSArray).count)
      XCTAssertEqual(37.773972, ((result as! NSArray).object(at: 0) as! NSDictionary).object(forKey: Location.Key.latitude.rawValue) as! Double)
      XCTAssertEqual(-122.431297, ((result as! NSArray).object(at: 0) as! NSDictionary).object(forKey: Location.Key.longitude.rawValue) as! Double)
      XCTAssertEqual(location2Time * 1000, ((result as! NSArray).object(at: 0) as! NSDictionary).object(forKey: Location.Key.time.rawValue) as! Double)
      XCTAssertEqual(40.730610, ((result as! NSArray).object(at: 1) as! NSDictionary).object(forKey: Location.Key.latitude.rawValue) as! Double)
      XCTAssertEqual(-73.935242, ((result as! NSArray).object(at: 1) as! NSDictionary).object(forKey: Location.Key.longitude.rawValue) as! Double)
      XCTAssertEqual(location1Time * 1000, ((result as! NSArray).object(at: 1) as! NSDictionary).object(forKey: Location.Key.time.rawValue) as! Double)
      expect3.fulfill()
    }, reject: rejecterFulfilling(expectation: expect3))

    wait(for: [expect3], timeout: 5)
  }
  
  func testOldLocationsTrimmed() {
    // given
    let location1Date = Date().addingTimeInterval(-(GPSSecureStorage.DAYS_TO_KEEP + 1)*24*60*60)
    let location1Time = location1Date.timeIntervalSince1970
    let backgroundLocation1 = TestMAURLocation(latitude: 40.730610, longitude: -73.935242, date: location1Date)
    let location2Date = Date()
    let location2Time = location2Date.timeIntervalSince1970
    let backgroundLocation2 = TestMAURLocation(latitude: 40.730610, longitude: -73.935242, date: location2Date)

    let expect1 = XCTestExpectation(description: "Save Device Location 1")
    let expect2 = XCTestExpectation(description: "Save Device Location 2")
    let expect3 = XCTestExpectation(description: "Trim Locations")

    secureStorage!.saveDeviceLocation(backgroundLocation1, backfill: false) {
      expect1.fulfill()
    }
    secureStorage!.saveDeviceLocation(backgroundLocation2, backfill: false) {
      expect2.fulfill()
    }

    wait(for: [expect1, expect2], timeout: 5)

    // when
    secureStorage!.trimLocations(
      backfill: false,
      resolve: resolverFulfilling(expectation: expect3),
      reject: rejecterFulfilling(expectation: expect3)
    )

    wait(for: [expect3], timeout: 5)
    
    // then
    XCTAssertNil(querySingleLocationByTime(time: location1Time))
    XCTAssertNotNil(querySingleLocationByTime(time: location2Time))
  }
  
  func testAssumedLocationListGenerated() {
    let newLocationDate =  Date()
    let oldLocationDate = newLocationDate.addingTimeInterval(-2.5 * GPSSecureStorage.LOCATION_INTERVAL)
    let oldLocationTimestamp = oldLocationDate.timeIntervalSince1970

    let oldLocation = createTestLocation(time: oldLocationTimestamp, latitude: 39.09772, longitude: -94.582959)
    let newLocation = TestMAURLocation(latitude: 39.097769, longitude: -94.582937, date: newLocationDate)
    
    let assumedLocations = GPSSecureStorage.createAssumedLocations(previousLocation: oldLocation, newLocation: newLocation)
    
    XCTAssertEqual(2, assumedLocations.count)
    XCTAssertGreaterThan(assumedLocations[0].time, assumedLocations[1].time)
    XCTAssertEqual(oldLocationTimestamp + GPSSecureStorage.LOCATION_INTERVAL, assumedLocations[1].time)
    XCTAssertEqual(oldLocation.latitude, assumedLocations[1].latitude)
    XCTAssertEqual(oldLocation.longitude, assumedLocations[1].longitude)
    XCTAssertEqual(oldLocationTimestamp + 2 * GPSSecureStorage.LOCATION_INTERVAL, assumedLocations[0].time)
    XCTAssertEqual(oldLocation.latitude, assumedLocations[0].latitude)
    XCTAssertEqual(oldLocation.longitude, assumedLocations[0].longitude)
    XCTAssertGreaterThan(assumedLocations[0].hashes.count, 0)
    XCTAssertGreaterThan(assumedLocations[1].hashes.count, 0)
  }
  
  func testMaxAssumedLocationListGenerated() {
    let newLocationDate =  Date()
    let oldLocationDate = newLocationDate.addingTimeInterval(-24 * 60 * 60)

    let oldLocation = createTestLocation(time: oldLocationDate.timeIntervalSince1970, latitude: 10.0, longitude: 10.0)
    let newLocation = TestMAURLocation(latitude: 10.0, longitude: 10.0, date: newLocationDate)
    
    let assumedLocations = GPSSecureStorage.createAssumedLocations(previousLocation: oldLocation, newLocation: newLocation)
    let assumedLocationsWithHashes = assumedLocations.filter { !$0.hashes.isEmpty }
    
    XCTAssertEqual(Int(newLocationDate.timeIntervalSince(oldLocationDate) / GPSSecureStorage.LOCATION_INTERVAL) - 1, assumedLocations.count)
    XCTAssertEqual(GPSSecureStorage.MAX_BACKFILL_HASHES, assumedLocationsWithHashes.count)
  }
  
  func testMaxAssumedLocationListEmptyIfTimeTooClose() {
    let location1Date = Date().addingTimeInterval(-0.9 * GPSSecureStorage.LOCATION_INTERVAL)

    let oldLocation = createTestLocation(time: location1Date.timeIntervalSince1970, latitude: 10.0, longitude: 10.0)
    let newLocation = TestMAURLocation(latitude: 10.0, longitude: 10.0, date: Date())
    
    let assumedLocations = GPSSecureStorage.createAssumedLocations(previousLocation: oldLocation, newLocation: newLocation)
    
    XCTAssertEqual(0, assumedLocations.count)
  }

  func testRemoveAllLocations() {
    let location1Date = Date().addingTimeInterval(GPSSecureStorage.LOCATION_INTERVAL)
    let location1Time = location1Date.timeIntervalSince1970
    let backgroundLocation1 = TestMAURLocation(latitude: 40.730610, longitude: -73.935242, date: location1Date)
    let location2Date = Date()
    let location2Time = location2Date.timeIntervalSince1970
    let backgroundLocation2 = TestMAURLocation(latitude: 40.730610, longitude: -73.935242, date: location2Date)

    let expect1 = XCTestExpectation(description: "Save Device Location 1")
    let expect2 = XCTestExpectation(description: "Save Device Location 2")
    let expect3 = XCTestExpectation(description: "Remove All Locations")

    secureStorage!.saveDeviceLocation(backgroundLocation1, backfill: false) {
      expect1.fulfill()
    }
    secureStorage!.saveDeviceLocation(backgroundLocation2, backfill: false) {
      expect2.fulfill()
    }

    wait(for: [expect1, expect2], timeout: 5)

    secureStorage!.removeAllLocations(
      resolve: resolverFulfilling(expectation: expect3),
      reject: rejecterFulfilling(expectation: expect3)
    )

    wait(for: [expect3], timeout: 5)

    XCTAssertNil(querySingleLocationByTime(time: location1Time))
    XCTAssertNil(querySingleLocationByTime(time: location2Time))
  }
  
  func querySingleLocationByTime(time: Double) -> Location? {
    return secureStorage!
      .getRealmInstance()!
      .objects(Location.self)
      .filter("\(Location.Key.time.rawValue) BETWEEN {\(time - 0.01), \(time + 0.01)}")
      .first
  }

  func resolverFulfilling(expectation: XCTestExpectation) -> RCTPromiseResolveBlock {
    return { _ in
      expectation.fulfill()
    }
  }

  func rejecterFulfilling(expectation: XCTestExpectation) -> RCTPromiseRejectBlock {
    return { _, _, _ in
      expectation.fulfill()
    }
  }
  
  func createTestLocation(time: Double, latitude: Double, longitude: Double) -> Location {
    let location = Location()
    location.latitude = latitude
    location.longitude = longitude
    location.time = time
    return location
  }
}

class TestMAURLocation: MAURLocation {
  init(latitude: Double, longitude: Double, date: Date) {
    super.init()
    self.latitude = NSNumber(floatLiteral: latitude)
    self.longitude = NSNumber(floatLiteral: longitude)
    self.time = date
  }
}
