#import "Device.h"
#import <UIKit/UIKit.h>

@implementation Device

//export the name of the native module as 'Device' since no explicit name is mentioned
RCT_EXPORT_MODULE();

//exports a method getVersion to javascript
RCT_EXPORT_METHOD(getVersion:(RCTResponseSenderBlock)callback){
 @try{
    callback(@[[NSNull null], [[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleShortVersionString"]]);
 }
 @catch(NSException *exception){
   callback(@[exception.reason, [NSNull null]]);
 }
}


//exports a method getBuild to javascript
RCT_EXPORT_METHOD(getBuildNumber:(RCTResponseSenderBlock)callback){
 @try{
    callback(@[[NSNull null], [[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleVersion"]]);
 }
 @catch(NSException *exception){
   callback(@[exception.reason, [NSNull null]]);
 }
}


@end