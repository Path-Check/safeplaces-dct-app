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

extension ExposureConfiguration {

  var asENExposureConfiguration: ENExposureConfiguration {
    let exposureConfiguration = ENExposureConfiguration()
    exposureConfiguration.minimumRiskScore = minimumRiskScore
    exposureConfiguration.attenuationLevelValues = attenuationLevelValues as [NSNumber]
    exposureConfiguration.attenuationWeight = attenuationWeight
    exposureConfiguration.daysSinceLastExposureLevelValues = daysSinceLastExposureLevelValues as [NSNumber]
    exposureConfiguration.daysSinceLastExposureWeight = daysSinceLastExposureWeight
    exposureConfiguration.durationLevelValues = durationLevelValues as [NSNumber]
    exposureConfiguration.durationWeight = durationWeight
    exposureConfiguration.transmissionRiskLevelValues = transmissionRiskLevelValues as [NSNumber]
    exposureConfiguration.transmissionRiskWeight = transmissionRiskWeight
    return exposureConfiguration
  }

}
