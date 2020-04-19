//
//  WorkingState.swift
//  PrivateKitTest WatchKit Extension
//
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.
//

import Foundation
import CoreLocation
import WatchConnectivity

struct LocData: Codable {
    var latitude: Double
    var longitude: Double
    var time: Double  // ms since 1970 UTC
    init() {
        latitude = 0
        longitude = 0
        time = 0
    }
}

class WorkingState {
    static let sharedInstance = WorkingState()
    var trackingEnabled = true
    let locationMgr = CLLocationManager()
    var status = " "
    var phoneListening = false
    var locationStatus = " "
    var savedLocs = [LocData]()
    let dispatchSemaphore = DispatchSemaphore(value: 1)
    var locationServices = true
    var watchConnectivitySupported = false
}
