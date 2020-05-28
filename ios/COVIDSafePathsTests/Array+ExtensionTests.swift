//
//  Array+ExtensionTests.swift
//  GPSTests
//
//  Created by Michael Neas on 5/28/20.
//  Copyright © 2020 Path Check Inc. All rights reserved.
// https://github.com/krzyzanowskim/CryptoSwift/blob/1755bd0917f401451d16faafe3c8e078b8eeb9c9/Tests/CryptoSwiftTests/ExtensionsTest.swift

import XCTest

class Array_ExtensionTests: XCTestCase {

    func testArrayInitHex() {
      let bytes = Array<UInt8>(hex: "0xb1b1b2b2")
      XCTAssertEqual(bytes, [177, 177, 178, 178])

      let str = "b1b2b3b3b3b3b3b3b1b2b3b3b3b3b3b3"
      let array = Array<UInt8>(hex: str)
      let hex = array.toHexString()
      XCTAssertEqual(str, hex)
    }
}
