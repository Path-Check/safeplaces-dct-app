//
//  ExtensionDelegate.swift
//  PrivateKitTest WatchKit Extension
//
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.
//

import WatchKit
import WatchConnectivity
import CoreLocation

let WCsetupDispatchSemaphore = DispatchSemaphore(value: 0)
class ExtensionDelegate: NSObject, WKExtensionDelegate {
    
    override init() {
        super.init()
        setupPhoneConnectivity()
    }
    
    func setupPhoneConnectivity() {  // may need to be called other than from init
        let ws = WorkingState.sharedInstance
        if !WCSession.isSupported() {
            NSLog("Watch Connectivity not supported")  // no UI to report to yet
            ws.watchConnectivitySupported = false
            ws.phoneListening = false
        } else {
            ws.watchConnectivitySupported = true
            WCSession.default.delegate = self
            WCSession.default.activate() // this is asynchronous, so wait for semaphore signaled by callback
            if (WCsetupDispatchSemaphore.wait(timeout: (DispatchTime.now() + .seconds(4))) == .success) {
                ws.phoneListening = true
            } else {
                ws.phoneListening = false
            }
        }
    }

    func applicationDidFinishLaunching() {  // called on startup OR if app has been suspended
        // Perform any final initialization of application.
        let ws = WorkingState.sharedInstance
        if (CLLocationManager.locationServicesEnabled()) {
            ws.locationServices = true
            ws.locationMgr.delegate = self
            ws.locationMgr.desiredAccuracy = kCLLocationAccuracyNearestTenMeters
            ws.locationMgr.requestWhenInUseAuthorization()
            ws.locationMgr.allowsBackgroundLocationUpdates = true
            ws.locationMgr.distanceFilter = 12.0   // min distance in meters moved before an event is generated
            if (WCSession.default.activationState == .activated) && WCSession.default.isReachable {  // phone nearby - start up without tracking
                ws.phoneListening = true
            } else {
                // started up with unreachable phone
                ws.phoneListening = false
            }
        } else {
             ws.locationServices = false
        }
     }

    func applicationDidBecomeActive() {
        // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
    }

    func applicationWillResignActive() {
        // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
        // Use this method to pause ongoing tasks, disable timers, etc.
    }

    func handle(_ backgroundTasks: Set<WKRefreshBackgroundTask>) {
        // Sent when the system needs to launch the application in the background to process tasks. Tasks arrive in a set, so loop through and process each one.
        for task in backgroundTasks {
            // Use a switch statement to check the task type
            switch task {
            case let backgroundTask as WKApplicationRefreshBackgroundTask:
                // Be sure to complete the background task once you’re done.
                backgroundTask.setTaskCompletedWithSnapshot(false)
                
            case let snapshotTask as WKSnapshotRefreshBackgroundTask:
                 // Snapshot tasks have a unique completion call, make sure to set your expiration date
                snapshotTask.setTaskCompleted(restoredDefaultState: true, estimatedSnapshotExpiration: Date.distantFuture, userInfo: nil)
            case let connectivityTask as WKWatchConnectivityRefreshBackgroundTask:
                // Be sure to complete the connectivity task once you’re done.
                connectivityTask.setTaskCompletedWithSnapshot(false)
            case let urlSessionTask as WKURLSessionRefreshBackgroundTask:
                // Be sure to complete the URL session task once you’re done.
                urlSessionTask.setTaskCompletedWithSnapshot(false)
            case let relevantShortcutTask as WKRelevantShortcutRefreshBackgroundTask:
                // Be sure to complete the relevant-shortcut task once you're done.
                relevantShortcutTask.setTaskCompletedWithSnapshot(false)
            case let intentDidRunTask as WKIntentDidRunRefreshBackgroundTask:
                // Be sure to complete the intent-did-run task once you're done.
                intentDidRunTask.setTaskCompletedWithSnapshot(false)
            default:
                // make sure to complete unhandled task types
                task.setTaskCompletedWithSnapshot(false)
            }
        }
    }
}

extension ExtensionDelegate: CLLocationManagerDelegate {
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        var currentLocation: CLLocation!
        var savingLoc = false
        let ws = WorkingState.sharedInstance
        let numSavedLocs = ws.savedLocs.count
        let updateTimeInterval = 60.0 * 5.0 * 1000.0 // 5 minutes in ms
        var locData = LocData()
        if (locations.count > 0) && (ws.trackingEnabled) {
            currentLocation = locations.last!    // last location is most recent
            locData.latitude = currentLocation.coordinate.latitude
            locData.longitude = currentLocation.coordinate.longitude
            locData.msSince1970UTC = (currentLocation.timestamp.timeIntervalSince1970 * 1000.0).rounded()
            if numSavedLocs == 0  { // always save first loc
                savingLoc = true
            } else {
                // applying temporal filtering only, spatial filtering is provided by .distanceFilter specified above in applicationDidFinishLaunching
                let lastLocTime = ws.savedLocs[numSavedLocs-1].msSince1970UTC
                let currentLocTime = locData.msSince1970UTC
                if (currentLocTime - lastLocTime) > updateTimeInterval {  // ignore any locs in past 5 minutes
                    savingLoc = true
                }
            }
            if savingLoc {
                ws.dispatchSemaphore.wait()  // block possible concurrent access to savedLocs in another thread
                ws.savedLocs.append(locData)
                ws.dispatchSemaphore.signal()  // release semaphore
                let locView = String(format: "%d: %.3f,%.3f %.0fm", ws.savedLocs.count, locData.latitude, locData.longitude, currentLocation.horizontalAccuracy.rounded())
                postNotificationOnMainQueueAsync(name: .locationDidArrive, object: locView)
            }
        }
    }
    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        if let error = error as? CLError, error.code == .denied {
            // Location updates are not authorized.
            print("\(#function): Updates not authorized")
            manager.stopUpdatingLocation()
        } else {
            print("\(#function): Location update failed")
            print(error.localizedDescription)
        }
     }
}

extension ExtensionDelegate: WCSessionDelegate {
    func session(_ session: WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) {
        let ws = WorkingState.sharedInstance
        if let error = error {
            print("WC Session activation failed with error: \(error.localizedDescription)")
            ws.phoneListening = false
        } else {
            print("WC Session activated with state: \(activationState.rawValue)")
            ws.phoneListening = true
        }
        WCsetupDispatchSemaphore.signal()  // signal callback received (sessions are activated asynchronously, so must for this callback signal
    }
        
    func sessionReachabilityDidChange(_ session: WCSession) {  // key callback that determines state of app
        // logic switches among 3 basic states:
        // 1) initial state of connected to phone with no saved locations
        // 2) not connected to phone and collecting locations
        // 3) connected to phone with location history available for upload to phone (then return to state 1)
        
        let ws = WorkingState.sharedInstance
        if !ws.phoneListening {  // previously was not reachable
            if (session.activationState == .activated) && session.isReachable { // was not reachable, and now is reachable: back to phone - allow saving locations
                ws.phoneListening = true
                ws.locationMgr.stopUpdatingLocation()
                if ws.savedLocs.count > 0 {  // back to phone with some locations collected
                    postNotificationOnMainQueueAsync(name: .showLocationControls, object: nil)
                    postNotificationOnMainQueueAsync(name: .statusDidChange, object: "Connected to phone. \(ws.savedLocs.count) locations can now be uploaded to phone.")
                } else {  // back to phone with no locations collected
                    postNotificationOnMainQueueAsync(name: .hideLocationControls, object: nil)
                    postNotificationOnMainQueueAsync(name: .hideLocation, object: nil)
                    postNotificationOnMainQueueAsync(name: .statusDidChange, object: initialStateMessage)
                }
            } else {
                setupPhoneConnectivity()  // get here after a watch reboot while away from phone
            }
        } else {  // previously was reachable
            if (session.activationState == .activated) && session.isReachable {
                // no change in status
            } else { // watch away from phone, start logging locations
                ws.phoneListening = false
                startLoggingLocations()
            }
        }
    }
}

public func startLoggingLocations() {
    let ws = WorkingState.sharedInstance
    if ws.trackingEnabled {
         ws.locationMgr.startUpdatingLocation()
         postNotificationOnMainQueueAsync(name: .showLocation, object: nil)
         postNotificationOnMainQueueAsync(name: .hideLocationControls, object: nil)  // could still be up from previous connection to phone without uploading
         postNotificationOnMainQueueAsync(name: .statusDidChange, object: "You are not connected to your phone. Tracking your location every 5 minutes.")
     }
}

public func postNotificationOnMainQueueAsync(name: NSNotification.Name, object: String? = nil) {
     DispatchQueue.main.async {
         NotificationCenter.default.post(name: name, object: object)
     }
 }

extension Notification.Name {
    static let locationDidArrive = Notification.Name("LocationDidArrive")
    static let statusDidChange = Notification.Name("StatusDidChange")
    static let hideLocation = Notification.Name("HideLocation")
    static let hideLocationControls = Notification.Name("HideLocationControls")
    static let showLocation = Notification.Name("ShowLocation")
    static let showLocationControls = Notification.Name("ShowLocationControls")
}
