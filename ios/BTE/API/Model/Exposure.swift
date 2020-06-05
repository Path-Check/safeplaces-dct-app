//
//  Exposure.swift
//  BTE
//
//  Created by Matthew Buckley on 6/5/20.
//  Copyright © 2020 Path Check Inc. All rights reserved.
//

import ExposureNotification
import Foundation

struct Exposure: Codable {
  let date: Date
  let duration: TimeInterval
  let totalRiskScore: ENRiskScore
  let transmissionRiskLevel: ENRiskLevel
}
