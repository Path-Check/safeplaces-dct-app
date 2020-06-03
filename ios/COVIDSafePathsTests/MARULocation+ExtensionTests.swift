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
    let backgroundLocation = TestMAURLocation(latitude: 41.24060321, longitude: 14.91328448, date: Date(timeIntervalSince1970: 1586865600000))
    let input = "gcpuuz8u1586865600"
    XCTAssertEqual(backgroundLocation.scrypt(on: input), "e727d7eb7c51d1b3")
  }

  func testValidScrypt() {
    let date = Date(timeIntervalSince1970: 1589117939000)
    let backgroundLocation = TestMAURLocation(latitude: 41.24060321, longitude: 14.91328448, date: date)
    let scryptHashes = backgroundLocation.scryptHashes
    let expectedHashes = [
      "a2dcd196d350fda7",
      "9ec071d139d8221f",
      "b3ddc01c5c2666e3",
      "c0d26f3cc00fe1ac",
      "5a9f2a50f0a8460e",
      "37eb1f8a2949e0bd",
      "6a900d469793d572",
      "6f0cc27428f105b8"
    ]

    for hash in scryptHashes {
      XCTAssertTrue(expectedHashes.contains(hash))
    }
  }
}
