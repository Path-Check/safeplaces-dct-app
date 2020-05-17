//
//  COVIDSafePathsConfig.m
//  COVIDSafePaths
//
//  Created by John Schoeman on 5/17/20.
//  Copyright © 2020 Path Check Inc. All rights reserved.
//

#import <Foundation/Foundation.h>

#import <Foundation/Foundation.h>
#import "COVIDSafePathsConfig.h"

@implementation COVIDSafePathsConfig : NSObject
  
RCT_EXPORT_MODULE();

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getAppName) {
  return [[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleDisplayName"];
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getTracingStrategy) {
  return @"bte";
}

@end
