#import <Foundation/Foundation.h>
#import <React/RCTLog.h>
#import <React/RCTBridgeModule.h>
#import "BT-Swift.h"

@interface KeySubmissionModule: NSObject <RCTBridgeModule>
@end

@implementation KeySubmissionModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(postDiagnosisKeys: (RCTResponseSenderBlock)callback) {
  [[ExposureManager shared] getAndPostDiagnosisKeysWithCallback:callback];
}

@end
