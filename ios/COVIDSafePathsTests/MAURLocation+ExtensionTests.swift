//
//  MAURLocation+ExtensionTests.swift
//  GPSTests
//
//  Created by Michael Neas on 5/27/20.
//  Copyright © 2020 Path Check Inc. All rights reserved.
//
import XCTest

class MAURLocation_ExtensionTests: XCTestCase {
  
  func testTimeWindow() {
    let date = Date(timeIntervalSince1970: 1586865792000)
    let backgroundLocation = TestMAURLocation(latitude: 41.24060321, longitude: 14.91328448, date: date)
    let windows = backgroundLocation.timeWindows(interval: 60 * 5 * 1000)
    XCTAssertEqual(windows.early, 1586865600000)
    XCTAssertEqual(windows.late, 1586865900000)
  }

  func testScryptHashSpec() {
    let date = Date(timeIntervalSince1970: 1589117939000)
    let backgroundLocation = TestMAURLocation(latitude: 41.24060321, longitude: 14.91328448, date: date)
    let scryptHashes = backgroundLocation.geoHashes

    let hashes = ["sr6de7ee1589118000000",
    "sr6de7ee1589117700000",
    "sr6de7es1589118000000",
    "sr6de7es1589117700000",
    "sr6de7e71589118000000",
    "sr6de7e71589117700000",
    "sr6de7ek1589118000000",
    "sr6de7ek1589117700000"
    ]
    
    for hash in scryptHashes  {
      XCTAssertTrue(hashes.contains(hash))
    }
  }
  
  func testScrypt() {
    let date = Date(timeIntervalSince1970: 1586865600)
    let backgroundLocation = TestMAURLocation(latitude: 41.24060321, longitude: 14.91328448, date: date)
    let input = "gcpuuz8u1586865600"
    XCTAssertEqual(backgroundLocation.scrypt(on: input), "0ed62968fef3dc0a")
  }
  
  func testValidScript() {
    let date = Date(timeIntervalSince1970: 1586865600)
    let backgroundLocation = TestMAURLocation(latitude: 41.24060321, longitude: 14.91328448, date: date)
    let scryptHashes = backgroundLocation.scryptHashes
    XCTAssertTrue(scryptHashes.contains("e2754c01925484c5"))
  }
}
