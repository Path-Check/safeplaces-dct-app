#import <React/RCTLog.h>
#import <React/RCTBridgeModule.h>
#import "BTE-Swift.h"

@interface PTCExposureManagerModule: NSObject <RCTBridgeModule>
@end

@implementation PTCExposureManagerModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(requestExposureNotificationAuthorization: (RCTResponseSenderBlock)callback) {
  [[ExposureManager shared] requestExposureNotificationAuthorization:callback];
}

@end
