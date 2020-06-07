#import <React/RCTLog.h>
#import <React/RCTBridgeModule.h>
#import "BTE-Swift.h"

@interface DebugMenuModule: NSObject <RCTBridgeModule>
@end

@implementation DebugMenuModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(fetchDiagnosisKeys: (RCTResponseSenderBlock)callback) {
  [[ExposureManager shared] handleDebugAction:DebugActionFetchDiagnosisKeys completion:^(NSArray *response) {
    id error = response[0];
    id payload = response[1];
    callback(@[error, payload]);
  }];
}

RCT_EXPORT_METHOD(detectExposuresNow: (RCTResponseSenderBlock)callback) {
  [[ExposureManager shared] handleDebugAction:DebugActionDetectExposuresNow completion:^(NSArray *response) {
    id error = response[0];
    id payload = response[1];
    callback(@[error, payload]);
  }];
}

RCT_EXPORT_METHOD(simulateExposureDetectionError: (RCTResponseSenderBlock)callback) {
  [[ExposureManager shared] handleDebugAction:DebugActionSimulateExposureDetectionError completion:^(NSArray *response) {
    id error = response[0];
    id payload = response[1];
    callback(@[error, payload]);
  }];
}

RCT_EXPORT_METHOD(simulateExposure: (RCTResponseSenderBlock)callback) {
  [[ExposureManager shared] handleDebugAction:DebugActionSimulateExposure completion:^(NSArray *response) {
    id error = response[0];
    id payload = response[1];
    callback(@[error, payload]);
  }];
}

RCT_EXPORT_METHOD(simulatePositiveDiagnosis: (RCTResponseSenderBlock)callback) {
  [[ExposureManager shared] handleDebugAction:DebugActionSimulatePositiveDiagnosis completion:^(NSArray *response) {
    id error = response[0];
    id payload = response[1];
    callback(@[error, payload]);
  }];
}

RCT_EXPORT_METHOD(disableExposureNotifications: (RCTResponseSenderBlock)callback) {
  [[ExposureManager shared] handleDebugAction:DebugActionDisableExposureNotifications completion:^(NSArray *response) {
    id error = response[0];
    id payload = response[1];
    callback(@[error, payload]);
  }];
}

RCT_EXPORT_METHOD(resetExposureDetectionError: (RCTResponseSenderBlock)callback) {
  [[ExposureManager shared] handleDebugAction:DebugActionResetExposureDetectionError completion:^(NSArray *response) {
    id error = response[0];
    id payload = response[1];
    callback(@[error, payload]);
  }];
}

RCT_EXPORT_METHOD(resetLocalExposures: (RCTResponseSenderBlock)callback) {
  [[ExposureManager shared] handleDebugAction:DebugActionResetLocalExposures completion:^(NSArray *response) {
    id error = response[0];
    id payload = response[1];
    callback(@[error, payload]);
  }];
}

RCT_EXPORT_METHOD(getAndPostDiagnosisKeys: (RCTResponseSenderBlock)callback) {
  [[ExposureManager shared] handleDebugAction:DebugActionGetAndPostDiagnosisKeys completion:^(NSArray *response) {
    id error = response[0];
    id payload = response[1];
    callback(@[error, payload]);
  }];
}

@end
