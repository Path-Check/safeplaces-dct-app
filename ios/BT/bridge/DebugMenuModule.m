#import <React/RCTLog.h>
#import <React/RCTBridgeModule.h>
#import "BT-Swift.h"

@interface DebugMenuModule: NSObject <RCTBridgeModule>
@end

@implementation DebugMenuModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(fetchDiagnosisKeys: (RCTResponseSenderBlock)callback) {
  [[ExposureManager shared] handleDebugAction:DebugActionFetchDiagnosisKeys callback:callback];
}

RCT_EXPORT_METHOD(detectExposuresNow: (RCTResponseSenderBlock)callback) {
  [[ExposureManager shared] handleDebugAction:DebugActionDetectExposuresNow callback:callback];
}

RCT_EXPORT_METHOD(simulateExposureDetectionError: (RCTResponseSenderBlock)callback) {
  [[ExposureManager shared] handleDebugAction:DebugActionSimulateExposureDetectionError callback:callback];
}

RCT_EXPORT_METHOD(simulateExposure: (RCTResponseSenderBlock)callback) {
  [[ExposureManager shared] handleDebugAction:DebugActionSimulateExposure callback:callback];
}

RCT_EXPORT_METHOD(toggleExposureNotifications: (RCTResponseSenderBlock)callback) {
   [[ExposureManager shared] handleDebugAction:DebugActionToggleENAuthorization callback:callback];
}

RCT_EXPORT_METHOD(resetExposureDetectionError: (RCTResponseSenderBlock)callback) {
  [[ExposureManager shared] handleDebugAction:DebugActionResetExposureDetectionError callback:callback];
}

RCT_EXPORT_METHOD(resetExposures: (RCTResponseSenderBlock)callback) {
  [[ExposureManager shared] handleDebugAction:DebugActionResetExposures callback:callback];
}

RCT_EXPORT_METHOD(getAndPostDiagnosisKeys: (RCTResponseSenderBlock)callback) {
  [[ExposureManager shared] handleDebugAction:DebugActionGetAndPostDiagnosisKeys callback:callback];
}

@end
