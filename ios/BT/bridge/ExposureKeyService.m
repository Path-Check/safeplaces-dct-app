#import <Foundation/Foundation.h>
#import <React/RCTLog.h>
#import <React/RCTBridgeModule.h>
#import "BT-Swift.h"

@interface ExposureKeyServiceModule: NSObject <RCTBridgeModule>
@end

@implementation ExposureKeyServiceModule

RCT_EXPORT_MODULE();
//
//RCT_EXPORT_METHOD(getExposureKeys: (RCTResponseSenderBlock)callback) {
//  [[ExposureManager shared] getExposureKeys:callback];
//}


@end
