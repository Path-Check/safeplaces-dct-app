//
//  SecureStorageManager.swift
//  COVIDSafePaths
//
//  Created by Tyler Roach on 4/29/20.
//  Copyright © 2020 Path Check Inc. All rights reserved.
//

import Foundation

@objc(SecureStorageManager)
class SecureStorageManager: NSObject {
  
  @objc static func requiresMainQueueSetup() -> Bool {
      return false
  }
  
  @objc
  func getLocations(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
    SecureStorage.shared.getLocations(resolve: resolve, reject: reject)
  }
  
  @objc
  func importGoogleLocations(_ locations: NSArray, resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
    SecureStorage.shared.importLocations(locations: locations, source: Location.SOURCE_GOOGLE, resolve: resolve, reject: reject)
  }
  
  @objc
  func migrateExistingLocations(_ locations: NSArray, resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
    SecureStorage.shared.importLocations(locations: locations, source: Location.SOURCE_MIGRATION, resolve: resolve, reject: reject)
  }
}
