#import <React/RCTLog.h>
#import <React/RCTBridgeModule.h>
#import "BT-Swift.h"

@interface ENPermissionsModule: NSObject <RCTBridgeModule>
@end

@implementation ENPermissionsModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(requestExposureNotificationAuthorization: (RCTResponseSenderBlock)callback) {
  [[ExposureManager shared] requestExposureNotificationAuthorizationWithEnabled:YES callback:callback];
}

RCT_EXPORT_METHOD(getCurrentENPermissionsStatus: (RCTResponseSenderBlock)callback) {
  [[ExposureManager shared] getCurrentENPermissionsStatusWithCallback:callback];
}

@end
