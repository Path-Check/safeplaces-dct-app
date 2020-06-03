//
//  SecureStorageManager.m
//  COVIDSafePaths
//
//  Created by Tyler Roach on 4/29/20.
//  Copyright © 2020 Path Check Inc. All rights reserved.
//

#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(SecureStorageManager, NSObject)

RCT_EXTERN_METHOD(
                  getLocations: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
                  importGoogleLocations: (NSArray)locations
                  resolve: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
                  migrateExistingLocations: (NSArray)locations
                  resolve: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject
)
@end
