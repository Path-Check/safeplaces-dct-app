import Foundation

extension String {
  static let `default` = ""
  static let notAuthorized = "notAuthorized"
  static let authorized = "authorized"
  static let keyPathTestResults = "testResults"
  static let keyPathExposureDetectionErrorLocalizedDescription = "exposureDetectionErrorLocalizedDescription"
  static let keyPathDateLastPerformedExposureDetection = "dateLastPerformedExposureDetection"
  static let keyPathExposures = "exposures"
  static let postKeysUrl = "POST_DIAGNOSIS_KEYS_URL"
  static let downloadKeyFile = "DOWNLOAD_KEY_FILE_URL"
  static let indexFileUrl = "INDEX_FILE_URL"

  var gaenFilePaths: [String] {
    split(separator: "\n").map { String($0) }
  }
}
