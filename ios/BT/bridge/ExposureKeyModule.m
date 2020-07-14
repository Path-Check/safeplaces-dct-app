#import <Foundation/Foundation.h>
#import <React/RCTLog.h>
#import <React/RCTBridgeModule.h>
#import "BT-Swift.h"

@interface ExposureKeyModule: NSObject <RCTBridgeModule>
@end

@implementation ExposureKeyModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(storeHMACKey: (NSString *)HMACKey withCallback:(RCTResponseSenderBlock)callback) {
  [[ExposureManager shared] storeHMACKeyWithHMACKey:HMACKey callback:callback];
}

RCT_REMAP_METHOD(fetchExposureKeys,
                fetchExposureKeysWithResolver:(RCTPromiseResolveBlock)resolve
                rejecter:(RCTPromiseRejectBlock)reject)
{
  [[ExposureManager shared] fetchExposureKeysWithResolve:resolve reject:reject];
}

@end
