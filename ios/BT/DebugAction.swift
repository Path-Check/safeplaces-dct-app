@objc enum DebugAction: Int {
  case fetchDiagnosisKeys,
  detectExposuresNow,
  simulateExposureDetectionError,
  simulateExposure,
  fetchExposures,
  getAndPostDiagnosisKeys,
  resetExposures,
  toggleENAuthorization,
  showLastProcessedFilePath
}
