//
//  InterfaceController.swift
//  PrivateKitTest WatchKit Extension
//
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.
//

import WatchKit
import Foundation
import CoreMotion
import WatchConnectivity


let licenseInfo = "MIT License"  //update when full text is known
public let initialStateMessage = "iPhone connected. Tracking will begin when your phone is not reachable via WiFi or bluetooth."
public let phoneNotReachableMessage = "Paired iPhone is not reachable"
class InterfaceController: WKInterfaceController{
    @IBAction func info() {
        status.setText("COVID Safe Paths Roam v" +  (Bundle.main.object(forInfoDictionaryKey: "CFBundleShortVersionString") as! String) + "\n" + licenseInfo)
    }
    @IBOutlet weak var locationStatus: WKInterfaceLabel!
    @IBOutlet weak var status: WKInterfaceLabel!
    @IBOutlet weak var trackingEnabled: WKInterfaceButton!
    @IBAction func trackingButton() {
        let ws = WorkingState.sharedInstance
        if ws.trackingEnabled { // currently tracking, so stop tracking
            if ws.locationMgr.location != nil {  // location  updating has been on
                ws.locationMgr.stopUpdatingLocation()
            }
            ws.trackingEnabled = false
            status.setText("Stopped Tracking")
            trackingEnabled.setTitle("Start Tracking")
        } else {
            // start tracking again
            if ws.locationServices {
                if ws.phoneListening {
                    postNotificationOnMainQueueAsync(name: .statusDidChange, object: initialStateMessage)
                } else {
                    ws.locationMgr.startUpdatingLocation()
                    status.setText("Restarted Tracking")
                }
                ws.trackingEnabled = true
                trackingEnabled.setTitle("Stop Tracking")
            } else {
                postNotificationOnMainQueueAsync(name: .statusDidChange, object: "Location services not enabled")
            }
        }
    }
    
    @IBOutlet weak var xfer: WKInterfaceButton!
    @IBAction func xferButton() {
        let ws = WorkingState.sharedInstance
        var sendSuccess = true
        if ws.savedLocs.count > 0 {
            
            postNotificationOnMainQueueAsync(name: .statusDidChange, object: "Sending \(ws.savedLocs.count) locations to iPhone")
            sendSuccess = sendLocsToPhone(ws.savedLocs)
            clearSavedLocs()
            if sendSuccess {
                returnToInitalState()
            }
        } else {
            postNotificationOnMainQueueAsync(name: .statusDidChange, object: "No locations to send")
        }
    }
    
    @IBAction func clearLocations() {
        clearSavedLocs()
        returnToInitalState()
    }
    
    func clearSavedLocs() {
        let ws = WorkingState.sharedInstance
        ws.dispatchSemaphore.wait()  // prevent access in another thread (background location updates) while removing elements
        ws.savedLocs.removeAll(keepingCapacity: true)  // reinitialize location collection
        ws.dispatchSemaphore.signal()
        postNotificationOnMainQueueAsync(name: .locationDidArrive, object: " ")  // update location view
    }
    
    func returnToInitalState() {
        postNotificationOnMainQueueAsync(name: .hideLocation, object: nil)
        postNotificationOnMainQueueAsync(name: .hideLocationControls, object: nil)
        postNotificationOnMainQueueAsync(name: .statusDidChange, object: initialStateMessage)
    }
    
    @IBOutlet weak var locationControlGroup: WKInterfaceGroup! // for hiding/showing
   
    
    // handle watch reboot/restart while away from phone
    @IBOutlet weak var noPhoneFoundGroup: WKInterfaceGroup!  // for hiding/showing
    @IBAction func retryPhoneConnect() {
        let phoneSession = WCSession.default
        if (phoneSession.activationState == .activated) &&  phoneSession.isReachable {
            noPhoneFoundGroup.setHidden(true)
            returnToInitalState()
        } else {
            postNotificationOnMainQueueAsync(name: .statusDidChange, object: phoneNotReachableMessage)
        }
    }
    
    @IBAction func manualLogStart() {
        noPhoneFoundGroup.setHidden(true)
        startLoggingLocations()
    }
    
    override func awake(withContext context: Any?) {
        super.awake(withContext: context)
        // Configure interface objects here.
        let ws = WorkingState.sharedInstance
        var initMsg: String!
        NotificationCenter.default.addObserver(
             self, selector: #selector(type(of: self).locationDidArrive(_:)),
             name: .locationDidArrive, object: nil
         )
         
         NotificationCenter.default.addObserver(
             self, selector: #selector(type(of: self).statusDidChange(_:)),
             name: .statusDidChange, object: nil
         )
        NotificationCenter.default.addObserver(
            self, selector: #selector(type(of: self).hideLocation(_:)),
            name: .hideLocation, object: nil
        )
        NotificationCenter.default.addObserver(
            self, selector: #selector(type(of: self).hideLocationControls(_:)),
            name: .hideLocationControls, object: nil
        )

        NotificationCenter.default.addObserver(
            self, selector: #selector(type(of: self).showLocation(_:)),
            name: .showLocation, object: nil
        )
        NotificationCenter.default.addObserver(
            self, selector: #selector(type(of: self).showLocationControls(_:)),
            name: .showLocationControls, object: nil
        )
        
        if (WCSession.default.activationState == .activated) && WCSession.default.isReachable {
            initMsg = initialStateMessage
            noPhoneFoundGroup.setHidden(true)
        } else {
            initMsg = phoneNotReachableMessage
            noPhoneFoundGroup.setHidden(false)
        }
        postNotificationOnMainQueueAsync(name: .hideLocation, object: nil)
        postNotificationOnMainQueueAsync(name: .hideLocationControls, object: nil)
        postNotificationOnMainQueueAsync(name: .statusDidChange, object: initMsg)
        if !ws.locationServices {
            locationStatus.setText("LOCATION SERVICES NOT ENABLED")
        }
    }
    
    override func willActivate() {
        // This method is called when watch view controller is about to be visible to user
        super.willActivate()
    }
    
    override func didDeactivate() {
        // This method is called when watch view controller is no longer visible
        super.didDeactivate()
    }
    // .locationDidChange notification handler.
    // Update the UI based on the notification text.
    //
    @objc
     func locationDidArrive(_ notification: Notification) {
         guard let locString = notification.object as? String else { return }
         locationStatus.setText(locString)
     }
    @objc
        func statusDidChange(_ notification: Notification) {
            guard let statusString = notification.object as? String else { return }
            status.setText(statusString)
        }
    
    @objc
         func hideLocation(_ notification: Notification) {
             locationStatus.setHidden(true)
         }
     
     @objc
         func showLocation(_ notification: Notification) {
             locationStatus.setHidden(false)
         }
    @objc
         func hideLocationControls(_ notification: Notification) {
             locationControlGroup.setHidden(true)
         }
     
     @objc
         func showLocationControls(_ notification: Notification) {
             locationControlGroup.setHidden(false)
         }
}

func sendLocsToPhone (_ locs: [LocData]) -> Bool {
    let ws = WorkingState.sharedInstance
    var locsCopy = [LocData]()
    var sendError = false
    var sendErrorMsg = ""
    let aJSONEncoder = JSONEncoder()
    aJSONEncoder.outputFormatting = .sortedKeys   // struct elements go out in order
    ws.dispatchSemaphore.wait()  // block possible concurrent access to locs in another thread
    locsCopy = locs
    ws.dispatchSemaphore.signal()
    let phoneSession = WCSession.default
    if (phoneSession.activationState == .activated) && phoneSession.isReachable {
        if locs.count > 0 {
            var resultStatus: String!
            do {
                let jsonString = try aJSONEncoder.encode(locsCopy)
                phoneSession.sendMessage(["location" : String(data: jsonString, encoding: .utf8)!], replyHandler: nil, errorHandler: {
                    (error: Error) in sendError = true
                                      sendErrorMsg = error.localizedDescription
                    })
            } catch {
                sendError = true
                sendErrorMsg = "Unable to convert locations into JSON"   // supremely unlikely
            }
            resultStatus = sendError ? "Error on xmit to iPhone: \(sendErrorMsg)" : "\(locs.count) location" + (locs.count > 1 ? "s" : "") + " sent to iPhone"
            postNotificationOnMainQueueAsync(name: .statusDidChange, object: resultStatus)
        }
    }
    return !sendError
}

