#import <React/RCTLog.h>
#import <React/RCTBridgeModule.h>
#import "BT-Swift.h"

@interface DebugMenuModule: NSObject <RCTBridgeModule>
@end

@implementation DebugMenuModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(fetchDiagnosisKeys: (RCTResponseSenderBlock)callback) {
  [[ExposureManager shared] handleDebugAction:DebugActionFetchDiagnosisKeys completion:^(NSArray *response) {
    id errorMessage = response[0];
    id successMessage = response[1];
    callback(@[errorMessage, successMessage]);
  }];
}

RCT_EXPORT_METHOD(detectExposuresNow: (RCTResponseSenderBlock)callback) {
  [[ExposureManager shared] handleDebugAction:DebugActionDetectExposuresNow completion:^(NSArray *response) {
    id errorMessage = response[0];
    id successMessage = response[1];
    callback(@[errorMessage, successMessage]);
  }];
}

RCT_EXPORT_METHOD(simulateExposureDetectionError: (RCTResponseSenderBlock)callback) {
  [[ExposureManager shared] handleDebugAction:DebugActionSimulateExposureDetectionError completion:^(NSArray *response) {
    id errorMessage = response[0];
    id successMessage = response[1];
    callback(@[errorMessage, successMessage]);
  }];
}

RCT_EXPORT_METHOD(simulateExposure: (RCTResponseSenderBlock)callback) {
  [[ExposureManager shared] handleDebugAction:DebugActionSimulateExposure completion:^(NSArray *response) {
    id errorMessage = response[0];
    id successMessage = response[1];
    callback(@[errorMessage, successMessage]);
  }];
}

RCT_EXPORT_METHOD(toggleExposureNotifications: (RCTResponseSenderBlock)callback) {
   [[ExposureManager shared] handleDebugAction:DebugActionToggleENAuthorization completion:^(NSArray *response) {
     id errorMessage = response[0];
     id successMessage = response[1];
     callback(@[errorMessage, successMessage]);
   }];
}

RCT_EXPORT_METHOD(resetExposureDetectionError: (RCTResponseSenderBlock)callback) {
  [[ExposureManager shared] handleDebugAction:DebugActionResetExposureDetectionError completion:^(NSArray *response) {
    id errorMessage = response[0];
    id successMessage = response[1];
    callback(@[errorMessage, successMessage]);
  }];
}

RCT_EXPORT_METHOD(resetExposures: (RCTResponseSenderBlock)callback) {
  [[ExposureManager shared] handleDebugAction:DebugActionResetExposures completion:^(NSArray *response) {
    id errorMessage = response[0];
    id successMessage = response[1];
    callback(@[errorMessage, successMessage]);
  }];
}

RCT_EXPORT_METHOD(getAndPostDiagnosisKeys: (RCTResponseSenderBlock)callback) {
  [[ExposureManager shared] handleDebugAction:DebugActionGetAndPostDiagnosisKeys completion:^(NSArray *response) {
    id errorMessage = response[0];
    id successMessage = response[1];
    callback(@[errorMessage, successMessage]);
  }];
}

@end
