@objc enum DebugAction: Int {
  case fetchDiagnosisKeys,
  detectExposuresNow,
  simulateExposureDetectionError,
  simulateExposure,
  resetExposureDetectionError,
  getAndPostDiagnosisKeys,
  resetExposures,
  toggleENAuthorization
}
