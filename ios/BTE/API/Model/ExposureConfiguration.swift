//
//  ExposureConfiguration.swift
//  BTE
//
//  Created by Matthew Buckley on 6/5/20.
//  Copyright © 2020 Path Check Inc. All rights reserved.
//

import Foundation
import ExposureNotification

struct ExposureConfiguration: Codable {
  let minimumRiskScore: ENRiskScore
  let attenuationLevelValues: [ENRiskLevelValue]
  let attenuationWeight: Double
  let daysSinceLastExposureLevelValues: [ENRiskLevelValue]
  let daysSinceLastExposureWeight: Double
  let durationLevelValues: [ENRiskLevelValue]
  let durationWeight: Double
  let transmissionRiskLevelValues: [ENRiskLevelValue]
  let transmissionRiskWeight: Double
}
