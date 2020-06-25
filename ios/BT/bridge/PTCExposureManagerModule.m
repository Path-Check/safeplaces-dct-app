#import <React/RCTLog.h>
#import <React/RCTBridgeModule.h>
#import "BT-Swift.h"

@interface PTCExposureManagerModule: NSObject <RCTBridgeModule>
@end

@implementation PTCExposureManagerModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(requestExposureNotificationAuthorization: (RCTResponseSenderBlock)callback) {
  [[ExposureManager shared] requestExposureNotificationAuthorizationWithEnabled:YES callback:callback];
  // TODO This will call into the Android Native
  // TODO will have to create a module ENPermissionsModule
  // TODO This will be called ENPermissionsModule
  // This is an iOS file.ENPermissionsModule
  // I'll have an ENPermissionsModule.java or .kt
}

@end
