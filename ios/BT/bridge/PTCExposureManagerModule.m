#import <React/RCTLog.h>
#import <React/RCTBridgeModule.h>
#import "BT-Swift.h"

@interface PTCExposureManagerModule: NSObject <RCTBridgeModule>
@end

@implementation PTCExposureManagerModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(requestExposureNotificationAuthorization: (RCTResponseSenderBlock)callback) {
  [[ExposureManager shared] requestExposureNotificationAuthorizationWithEnabled:YES callback:callback];
}

@end
