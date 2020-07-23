//
//  Log.swift
//  COVIDSafePaths
//
//  Created by Michael Neas on 6/1/20.
//  Copyright © 2020 Path Check Inc. All rights reserved.
//

import Foundation
import os.log

struct Log {

  static var storage = Log(subsystem: "org.pathcheck.covid-safepaths", category: "storage")

  static var gps = Log(subsystem: "org.pathcheck.covid-safepaths", category: "gps")

  static var scryptHashing = Log(subsystem: "org.pathcheck.covid-safepaths", category: "performance")

  let subsystem: String
  let category: String

  private init(subsystem: String, category: String) {
    self.subsystem = subsystem
    self.category = category
  }

}

extension Log {

  func debug(_ message: @autoclosure () -> String, dso: UnsafeRawPointer? = #dsohandle) {
    if #available(iOS 10.0, *) {
      os_log("%@", dso: dso, log: osLog, type: .debug, message())
    }
  }

  func info(_ message: @autoclosure () -> String, dso: UnsafeRawPointer? = #dsohandle) {
    if #available(iOS 10.0, *) {
      os_log("%@", dso: dso, log: osLog, type: .info, message())
    }
  }

  func error(_ message: @autoclosure () -> String, dso: UnsafeRawPointer? = #dsohandle) {
    if #available(iOS 10.0, *) {
      os_log("%@", dso: dso, log: osLog, type: .error, message())
    }
  }

  @available(iOS 10.0, *)
  private var osLog: OSLog {
    return OSLog(subsystem: subsystem, category: category)
  }

}
