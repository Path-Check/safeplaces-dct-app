#import <React/RCTLog.h>
#import <React/RCTBridgeModule.h>
#import "BT-Swift.h"

@interface ENExposureModule: NSObject <RCTBridgeModule>
@end

@implementation ENExposureModule

RCT_EXPORT_MODULE();

RCT_REMAP_METHOD(fetchLastDetectionDate,
                 fetchLastDetectionDateWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  [[ExposureManager shared] fetchLastDetectionDateWithResolve:resolve reject:reject];
}

@end
