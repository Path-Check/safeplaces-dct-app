#import <Foundation/Foundation.h>
#import <React/RCTLog.h>
#import <React/RCTBridgeModule.h>
#import "BT-Swift.h"

@interface ExposureKeyModule: NSObject <RCTBridgeModule>
@end

@implementation ExposureKeyModule

RCT_EXPORT_MODULE();

RCT_REMAP_METHOD(fetchExposureKeys,
                 fetchExposureKeysWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  [[ExposureManager shared] fetchExposureKeysWithResolve:resolve reject:reject];
}

RCT_REMAP_METHOD(postDiagnosisKeys,
                 certificate: (NSString *)certificate
                 hmacKey: (NSString *)HMACKey
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  [[ExposureManager shared] getAndPostDiagnosisKeysWithCertificate:certificate HMACKey:HMACKey resolve:resolve reject:reject];
}


@end
