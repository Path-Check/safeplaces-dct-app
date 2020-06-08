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
  @available(iOS 10.0, *)
  static var scryptHashing = OSLog(subsystem: "org.pathcheck.covid-safepaths", category: "performance")
}
