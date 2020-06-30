#import <React/RCTLog.h>
#import <React/RCTBridgeModule.h>
#import "BT-Swift.h"

@interface ENPermissionsModule: NSObject <RCTBridgeModule>
@end

@implementation ENPermissionsModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(requestExposureNotificationAuthorization: (RCTResponseSenderBlock)callback) {
  [[ExposureManager shared] requestExposureNotificationAuthorizationWithEnabled:YES callback:callback];
  // TODO This will call into the Android Native
  // TODO will have to create a module ENPermissionsModule
  // TODO This will be called ENPermissionsModule
  // This is an iOS file.ENPermissionsModule
  // I'll have an ENPermissionsModule.java or .kt
}

RCT_EXPORT_METHOD(getCurrentENPermissionsStatus: (RCTResponseSenderBlock)callback) {
  [[ExposureManager shared] getCurrentENPermissionsStatusWithCallback:callback];
}

@end
