#import <React/RCTLog.h>
#import <React/RCTBridgeModule.h>
#import "BT-Swift.h"

@interface DebugMenuModule: NSObject <RCTBridgeModule>
@end

@implementation DebugMenuModule

RCT_EXPORT_MODULE();

RCT_REMAP_METHOD(fetchDiagnosisKeys,
                 fetchDiagnosisKeysWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  [[ExposureManager shared] handleDebugAction:DebugActionFetchDiagnosisKeys resolve:resolve reject:reject];
}

RCT_REMAP_METHOD(detectExposuresNow,
                 detectExposuresNowWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
    [[ExposureManager shared] handleDebugAction:DebugActionDetectExposuresNow resolve:resolve reject:reject];
}

RCT_REMAP_METHOD(simulateExposureDetectionError,
                 simulateExposureDetectionErrorWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  [[ExposureManager shared] handleDebugAction:DebugActionSimulateExposureDetectionError resolve:resolve reject:reject];}

RCT_REMAP_METHOD(simulateExposure,
                 simulateExposureWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  [[ExposureManager shared] handleDebugAction:DebugActionSimulateExposure resolve:resolve reject:reject];
}

RCT_REMAP_METHOD(toggleExposureNotifications,
                 toggleExposureNotificationsWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  [[ExposureManager shared] handleDebugAction:DebugActionToggleENAuthorization resolve:resolve reject:reject];
}

RCT_REMAP_METHOD(resetExposures,
                 resetExposuresWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  [[ExposureManager shared] handleDebugAction:DebugActionResetExposures resolve:resolve reject:reject];
}

RCT_REMAP_METHOD(submitExposureKeys,
                 submitExposureKeysResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  [[ExposureManager shared] handleDebugAction:DebugActionGetAndPostDiagnosisKeys resolve:resolve reject:reject];
}

@end
