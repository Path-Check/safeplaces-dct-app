import Foundation
import ExposureNotification

struct ExposureConfiguration: Codable {

  let minimumRiskScore: ENRiskScore
  let attenuationDurationThresholds: [Int]
  let attenuationLevelValues: [ENRiskLevelValue]
  let daysSinceLastExposureLevelValues: [ENRiskLevelValue]
  let durationLevelValues: [ENRiskLevelValue]
  let transmissionRiskLevelValues: [ENRiskLevelValue]

}

extension ExposureConfiguration {

  static var placeholder: ExposureConfiguration = {
    ExposureConfiguration(minimumRiskScore: 1,
                          attenuationDurationThresholds: [50, 70],
                          attenuationLevelValues: [1, 2, 3, 4, 5, 6, 7, 8],
                          daysSinceLastExposureLevelValues: [1, 2, 3, 4, 5, 6, 7, 8],
                          durationLevelValues: [1, 2, 3, 4, 5, 6, 7, 8],
                          transmissionRiskLevelValues: [1, 2, 3, 4, 5, 6, 7, 8])
  }()

  var asENExposureConfiguration: ENExposureConfiguration {
    let config = ENExposureConfiguration()
    config.metadata = ["attenuationDurationThresholds": attenuationDurationThresholds]
    config.attenuationLevelValues = attenuationLevelValues.map { NSNumber(value: $0) }
    config.daysSinceLastExposureLevelValues = daysSinceLastExposureLevelValues.map { NSNumber(value: $0) }
    config.durationLevelValues = durationLevelValues.map { NSNumber(value: $0) }
    config.transmissionRiskLevelValues = transmissionRiskLevelValues.map { NSNumber(value: $0) }
    return config
  }

}
