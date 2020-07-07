import Foundation

extension String {
  static let `default` = ""
  static let notAuthorized = "notAuthorized"
  static let authorized = "authorized"
  static let keyPathTestResults = "testResults"
  static let keyPathExposureDetectionErrorLocalizedDescription = "exposureDetectionErrorLocalizedDescription"
  static let keyPathDateLastPerformedExposureDetection = "dateLastPerformedExposureDetection"
  static let keyPathExposures = "exposures"
  static let keyPathNextDiagnosisKeyFileIndex = "nextDiagnosisKeyFileIndex"
  static let postKeysUrl = "POST_DIAGNOSIS_KEYS_URL"
  static let downloadBaseUrl = "DOWNLOAD_BASE_URL"
  static let downloadPath = "DOWNLOAD_PATH"
  static let hmackey = "HMAC_KEY"
  static let bluetoothNotificationTitle = "Bluetooth Off"
  static let bluetoothNotificationBody = "You must enable bluetooth to receive Exposure Notifications."
  static let bluetoothNotificationIdentifier = "bluetooth-off"
  static let exposureDetectionErrorNotificationTitle = "Error Detecting Exposures"
  static let exposureDetectionErrorNotificationBody = "An error occurred while attempting to detect exposures."
  static let newExposureNotificationBody = "Someone you were near recently has been diagnosed with COVID-19. Tap for more details."
  static let exposureDetectionErrorNotificationIdentifier = "expososure-notification-error"
  static let genericSuccess = "success"

  func gaenFilePaths(startingAt idx: Int, batchSize: Int) -> [String] {
    guard !self.isEmpty else {
      return []
    }
    let relevantUrls = split(separator: "\n").map { String($0) }.filter { $0.contains(ReactNativeConfig.env(for: .downloadPath)) }
    let endIndex = Int(min(relevantUrls.count, idx + batchSize))
    return Array(relevantUrls[idx..<endIndex])
  }

  var localized: String {
    NSLocalizedString(self, comment: .default)
  }

}
