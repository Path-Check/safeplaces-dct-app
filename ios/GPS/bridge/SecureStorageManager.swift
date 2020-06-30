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
    GPSSecureStorage.shared.getLocations(resolve: resolve, reject: reject)
  }
  
  @objc
  func importGoogleLocations(_ locations: NSArray, resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
    GPSSecureStorage.shared.importLocations(locations: locations, source: .google, resolve: resolve, reject: reject)
  }
  
  @objc
  func migrateExistingLocations(_ locations: NSArray, resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
    GPSSecureStorage.shared.importLocations(locations: locations, source: .migration, resolve: resolve, reject: reject)
  }

  @objc
  func trimLocations(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
    GPSSecureStorage.shared.getLocations(resolve: resolve, reject: reject)
  }

}
