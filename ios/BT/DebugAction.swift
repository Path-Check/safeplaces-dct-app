@objc enum DebugAction: Int {
  case fetchDiagnosisKeys,
  detectExposuresNow,
  simulateExposureDetectionError,
  simulateExposure,
  resetExposureDetectionError,
  resetExposures,
  getAndPostDiagnosisKeys
}
