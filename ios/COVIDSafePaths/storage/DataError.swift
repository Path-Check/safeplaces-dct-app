//
//  DataError.swift
//  COVIDSafePaths
//
//  Created by Michael Neas on 5/22/20.
//  Copyright © 2020 Path Check Inc. All rights reserved.
//

import Foundation

enum DataError: Error {
  case missingInformation
  case noRealmConfig
}
