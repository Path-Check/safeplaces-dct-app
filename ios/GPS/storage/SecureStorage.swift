//
//  RealmWrapper.swift
//  COVIDSafePaths
//
//  Created by Tyler Roach on 4/23/20.
//  Copyright © 2020 Path Check Inc. All rights reserved.
//

import Foundation
import RealmSwift


class SecureStorage: NSObject {
  
  @objc static let shared = SecureStorage()
  
  private let secureStorage: RealmSecureStorage = RealmSecureStorage()
  
  @objc func saveDeviceLocation(backgroundLocation: MAURLocation) {
    DispatchQueue(label: "realm").async {
      autoreleasepool { [weak self] in
        guard let `self` = self else { return }
        self.secureStorage.saveDeviceLocation(backgroundLocation: backgroundLocation)
      }
    }
  }
  
  func importLocations(locations: NSArray, source: Int, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue(label: "realm").async {
      autoreleasepool { [weak self] in
        guard let `self` = self else { return }
        self.secureStorage.importLocations(locations: locations, source: source, resolve: resolve, reject: reject)
      }
    }
  }
  
  @objc func trimLocations() {
    DispatchQueue(label: "realm").async {
      autoreleasepool { [weak self] in
        guard let `self` = self else { return }
        self.secureStorage.trimLocations()
      }
    }
  }
  
  func getLocations(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue(label: "realm").async {
      autoreleasepool { [weak self] in
        guard let `self` = self else { return }
        self.secureStorage.getLocations(resolve: resolve, reject: reject)
      }
    }
  }
}
