@objc enum DebugAction: Int {
  case fetchDiagnosisKeys,
  detectExposuresNow,
  simulateExposureDetectionError,
  simulateExposure,
  getAndPostDiagnosisKeys,
  resetExposures,
  toggleENAuthorization
}
