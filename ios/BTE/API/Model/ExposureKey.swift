//
//  DiagnosisKey.swift
//  BTE
//
//  Created by Matthew Buckley on 6/5/20.
//  Copyright © 2020 Path Check Inc. All rights reserved.
//

import Foundation
import ExposureNotification

struct ExposureKey: Codable, Equatable {
  let keyData: Data
  let rollingPeriod: ENIntervalNumber
  let rollingStartNumber: ENIntervalNumber
  let transmissionRiskLevel: ENRiskLevel
}

extension ENTemporaryExposureKey {
  var asCodableKey: ExposureKey {
    ExposureKey(keyData: keyData,
                 rollingPeriod: rollingPeriod,
                 rollingStartNumber: rollingStartNumber,
                 transmissionRiskLevel: transmissionRiskLevel)
  }
}
