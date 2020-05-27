//
//  MAURLocation+ExtensionTests.swift
//  GPSTests
//
//  Created by Michael Neas on 5/27/20.
//  Copyright © 2020 Path Check Inc. All rights reserved.
//
import XCTest

class MAURLocation_ExtensionTests: XCTestCase {
//  func testScryptHashSpec() {
//    let date = Date(timeIntervalSince1970: 1586865792)
//    let backgroundLocation = TestMAURLocation(latitude: 51.5019, longitude: -0.1415, date: date)
//    XCTAssertEqual(backgroundLocation.nearestTimeStamp, 1586865600)
//    XCTAssertEqual(backgroundLocation.geohash(precision: 8), "gcpuuz8u")
//    XCTAssertEqual(backgroundLocation.scryptHash, "lFYQZWaU9QN5p804NLX1vw==")
//  }
  
  func testScryptHashSpec2() {
    let date = Date(timeIntervalSince1970: 1589117939000)
    let backgroundLocation = TestMAURLocation(latitude: 41.24060321, longitude: 14.91328448, date: date)
    XCTAssertEqual(backgroundLocation.nearestTimeStamp, 1589117938800)
    XCTAssertEqual(backgroundLocation.geohash(precision: 8), "sr6de7ee")
    XCTAssertEqual(backgroundLocation.scryptHash, "e2754c01925484c5")
  }
}
