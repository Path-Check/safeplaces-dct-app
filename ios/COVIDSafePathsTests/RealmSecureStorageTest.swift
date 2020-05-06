//
//  RealmSecureStorageTest.swift
//  COVIDSafePathsTests
//
//  Created by Tyler Roach on 5/5/20.
//  Copyright © 2020 Path Check Inc. All rights reserved.
//

import XCTest
import RealmSwift
@testable import COVIDSafePaths

class RealmSecureStorageTest: XCTestCase {
  
  var secureStorage: RealmSecureStorage?
  var hold: Realm?
  
  override func setUp() {
    super.setUp()
    secureStorage = RealmSecureStorage(inMemory: true)
    UserDefaults.standard.removeObject(forKey: secureStorage!.keyLastSavedTime)
    hold = secureStorage!.getRealmInstance()
  }
  
  override func tearDown() {
    super.tearDown()
    UserDefaults.standard.removeObject(forKey: secureStorage!.keyLastSavedTime)
    hold = nil
  }
  
  func testSaveDeviceLocation() {
    // given
    let location1Date = Date()
    let location1Time = Int(location1Date.timeIntervalSince1970)
    let backgroundLocation1 = TestLocation(latitude: 40.730610, longitude: -73.935242, date: location1Date)
  
    // when
    secureStorage!.saveDeviceLocation(backgroundLocation: backgroundLocation1)
    
    // then
    guard let resultLocation = querySingleLocationByTime(time: location1Time) else {
      XCTFail("Resulting location returned nil")
      return
    }
    XCTAssertEqual(40.730610, resultLocation.latitude)
    XCTAssertEqual(-73.935242, resultLocation.longitude)
    XCTAssertEqual(location1Time, resultLocation.time)
  }
  
  func testSaveDeviceLocationIgnoredIfPreviousInsertTooClose() {
    // given
    let location1Date = Date()
    let location1Time = Int(location1Date.timeIntervalSince1970)
    let backgroundLocation1 = TestLocation(latitude: 40.730610, longitude: -73.935242, date: location1Date)
    let location2Date = location1Date.addingTimeInterval(1)
    let location2Time = Int(location2Date.timeIntervalSince1970)
    let backgroundLocation2 = TestLocation(latitude: 40.730610, longitude: -73.935242, date: location2Date)
    
    // when
    secureStorage!.saveDeviceLocation(backgroundLocation: backgroundLocation1)
    secureStorage!.saveDeviceLocation(backgroundLocation: backgroundLocation2)
      
    // then
    XCTAssertNotNil(querySingleLocationByTime(time: location1Time))
    XCTAssertNil(querySingleLocationByTime(time: location2Time))
  }
  
  func testImportSuccessFromGoogle() {
    // given
    let location1TimeDouble = Date().timeIntervalSince1970 * 1000
    let location1Time = Int(location1TimeDouble / 1000)
    let location1 = [Location.KEY_TIME: location1TimeDouble, Location.KEY_LATITUDE: 40.730610, Location.KEY_LONGITUDE: -73.935242]
    let location2TimeDouble = Date().addingTimeInterval(10).timeIntervalSince1970 * 1000
    let location2TimeString = String(format:"%.0f", location2TimeDouble)
    let location2Time = Int(location2TimeDouble / 1000)
    let location2 = [Location.KEY_TIME: location2TimeString, Location.KEY_LATITUDE: 37.773972, Location.KEY_LONGITUDE: -122.431297] as [String : Any]
    let locations = NSArray(array: [location1, location2])

    // when
    secureStorage!.importLocations(
      locations: locations,
      source: Location.SOURCE_GOOGLE,
      resolve: { result in
        XCTAssertEqual(true, result as! Bool)
      },
      reject: emptyRejecter()
    )
    
    // then
    guard let resultLocation = querySingleLocationByTime(time: location1Time) else {
      XCTFail("Resulting location 1 returned nil")
      return
    }
    XCTAssertEqual(40.730610, resultLocation.latitude)
    XCTAssertEqual(-73.935242, resultLocation.longitude)
    XCTAssertEqual(location1Time, resultLocation.time)
    XCTAssertEqual(Location.SOURCE_GOOGLE, resultLocation.source)
    guard let resultLocation2 = querySingleLocationByTime(time: location2Time) else {
      XCTFail("Resulting location 2 returned nil")
      return
    }
    XCTAssertEqual(37.773972, resultLocation2.latitude)
    XCTAssertEqual(-122.431297, resultLocation2.longitude)
    XCTAssertEqual(location2Time, resultLocation2.time)
    XCTAssertEqual(Location.SOURCE_GOOGLE, resultLocation2.source)
  }
  
  func testImportSuccessFromMigration() {
    // given
    let location1TimeDouble = Date().timeIntervalSince1970 * 1000
    let location1Time = Int(location1TimeDouble / 1000)
    let location1 = [Location.KEY_TIME: location1TimeDouble, Location.KEY_LATITUDE: 40.730610, Location.KEY_LONGITUDE: -73.935242]
    let location2TimeDouble = Date().addingTimeInterval(10).timeIntervalSince1970 * 1000
    let location2TimeString = String(format:"%.0f", location2TimeDouble)
    let location2Time = Int(location2TimeDouble / 1000)
    let location2 = [Location.KEY_TIME: location2TimeString, Location.KEY_LATITUDE: 37.773972, Location.KEY_LONGITUDE: -122.431297] as [String : Any]
    let locations = NSArray(array: [location1, location2])

    // when
    secureStorage!.importLocations(
      locations: locations,
      source: Location.SOURCE_MIGRATION,
      resolve: { result in
        XCTAssertEqual(true, result as! Bool)
      },
      reject: emptyRejecter()
    )
    
    // then
    guard let resultLocation = querySingleLocationByTime(time: location1Time) else {
      XCTFail("Resulting location 1 returned nil")
      return
    }
    XCTAssertEqual(40.730610, resultLocation.latitude)
    XCTAssertEqual(-73.935242, resultLocation.longitude)
    XCTAssertEqual(location1Time, resultLocation.time)
    XCTAssertEqual(Location.SOURCE_MIGRATION, resultLocation.source)
    guard let resultLocation2 = querySingleLocationByTime(time: location2Time) else {
      XCTFail("Resulting location 2 returned nil")
      return
    }
    XCTAssertEqual(37.773972, resultLocation2.latitude)
    XCTAssertEqual(-122.431297, resultLocation2.longitude)
    XCTAssertEqual(location2Time, resultLocation2.time)
    XCTAssertEqual(Location.SOURCE_MIGRATION, resultLocation2.source)
  }
  
  func testImportFailsIfLocationOlderThanMinimum() {
    // given
    let location1TimeDouble = Date().addingTimeInterval(-15*24*60*60).timeIntervalSince1970 * 1000
    let location1Time = Int(location1TimeDouble / 1000)
    let location1 = [Location.KEY_TIME: location1TimeDouble, Location.KEY_LATITUDE: 40.730610, Location.KEY_LONGITUDE: -73.935242]
    let location2TimeDouble = Date().timeIntervalSince1970 * 1000
    let location2Time = Int(location2TimeDouble / 1000)
    let location2 = [Location.KEY_TIME: location2TimeDouble, Location.KEY_LATITUDE: 37.773972, Location.KEY_LONGITUDE: -122.431297]
    let locations = NSArray(array: [location1, location2])

    // when
    secureStorage!.importLocations(
      locations: locations,
      source: Location.SOURCE_MIGRATION,
      resolve: { result in
        XCTAssertEqual(true, result as! Bool)
      },
      reject: emptyRejecter()
    )
    
    // then
    XCTAssertNil(querySingleLocationByTime(time: location1Time))
    XCTAssertNotNil(querySingleLocationByTime(time: location2Time))
  }
  
  func testGetLocationsReturnsSortedAndFilters() {
    // given
    let location1Date = Date()
    let location1Time = Int(location1Date.timeIntervalSince1970)
    let backgroundLocation1 = TestLocation(latitude: 40.730610, longitude: -73.935242, date: location1Date)
    let location2TimeDouble = Date().addingTimeInterval(-10*24*60*60).timeIntervalSince1970 * 1000
    let location2Time = Int(location2TimeDouble / 1000)
    let location2 = [Location.KEY_TIME: location2TimeDouble, Location.KEY_LATITUDE: 37.773972, Location.KEY_LONGITUDE: -122.431297]
    let importLocations = NSArray(array: [location2])
    secureStorage!.saveDeviceLocation(backgroundLocation: backgroundLocation1)
    secureStorage!.importLocations(
      locations: importLocations,
      source: Location.SOURCE_MIGRATION,
      resolve: emptyResolver(),
      reject: emptyRejecter()
    )
    
    // when
    secureStorage!.getLocations(resolve: { result in
      XCTAssertEqual(2, (result as! NSArray).count)
      XCTAssertEqual(37.773972, ((result as! NSArray).object(at: 0) as! NSDictionary).object(forKey: Location.KEY_LATITUDE) as! Double)
      XCTAssertEqual(-122.431297, ((result as! NSArray).object(at: 0) as! NSDictionary).object(forKey: Location.KEY_LONGITUDE) as! Double)
      XCTAssertEqual(location2Time * 1000, ((result as! NSArray).object(at: 0) as! NSDictionary).object(forKey: Location.KEY_TIME) as! Int)
      XCTAssertEqual(40.730610, ((result as! NSArray).object(at: 1) as! NSDictionary).object(forKey: Location.KEY_LATITUDE) as! Double)
      XCTAssertEqual(-73.935242, ((result as! NSArray).object(at: 1) as! NSDictionary).object(forKey: Location.KEY_LONGITUDE) as! Double)
      XCTAssertEqual(location1Time * 1000, ((result as! NSArray).object(at: 1) as! NSDictionary).object(forKey: Location.KEY_TIME) as! Int)
    }, reject: emptyRejecter())
  }
  
  func testOldLocationsTrimmed() {
    // given
    let location1Date = Date().addingTimeInterval(-15*24*60*60)
    let location1Time = Int(location1Date.timeIntervalSince1970)
    let backgroundLocation1 = TestLocation(latitude: 40.730610, longitude: -73.935242, date: location1Date)
    let location2Date = Date()
    let location2Time = Int(location2Date.timeIntervalSince1970)
    let backgroundLocation2 = TestLocation(latitude: 40.730610, longitude: -73.935242, date: location2Date)
    secureStorage!.saveDeviceLocation(backgroundLocation: backgroundLocation1)
    secureStorage!.saveDeviceLocation(backgroundLocation: backgroundLocation2)
    
    // when
    secureStorage!.trimLocations()
    
    // then
    XCTAssertNil(querySingleLocationByTime(time: location1Time))
    XCTAssertNotNil(querySingleLocationByTime(time: location2Time))
  }
  
  func querySingleLocationByTime(time: Int) -> Location? {
    return secureStorage!.getRealmInstance()!.objects(Location.self).filter("\(Location.KEY_TIME)==\(time)").first
  }
  
  func emptyResolver() -> RCTPromiseResolveBlock {
    return { result in
        
    }
  }
  
  func emptyRejecter() -> RCTPromiseRejectBlock {
    return { code, message, error in
      
    }
  }
}

class TestLocation: MAURLocation {
  init(latitude: Double, longitude: Double, date: Date) {
    super.init()
    self.latitude = NSNumber(floatLiteral: latitude)
    self.longitude = NSNumber(floatLiteral: longitude)
    self.time = date
  }
}
