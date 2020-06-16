@objc enum DebugAction: Int {
  case fetchDiagnosisKeys,
  detectExposuresNow,
  simulateExposureDetectionError,
  simulateExposure,
  simulatePositiveDiagnosis,
  disableExposureNotifications,
  resetExposureDetectionError,
  resetUserENState,
  resetExposures,
  getAndPostDiagnosisKeys,
  getExposureConfiguration
}
