import Foundation
import ExposureNotification
import UserNotifications

@objc(ExposureManager)
final class ExposureManager: NSObject {
    
    @objc static let shared = ExposureManager()
    
    let manager = ENManager()
    
  override init() {
    super.init()
        manager.activate { _ in
            // Ensure exposure notifications are enabled if the app is authorized. The app
            // could get into a state where it is authorized, but exposure
            // notifications are not enabled,  if the user initially denied Exposure Notifications
            // during onboarding, but then flipped on the "COVID-19 Exposure Notifications" switch
            // in Settings.
            if ENManager.authorizationStatus == .authorized && !self.manager.exposureNotificationEnabled {
                self.manager.setExposureNotificationEnabled(true) { _ in
                    // No error handling for attempts to enable on launch
                }
            }
        }
    }
    
    deinit {
        manager.invalidate()
    }
  
  @objc func requestExposureNotificationAuthorization(_ callback: @escaping RCTResponseSenderBlock) {
    manager.setExposureNotificationEnabled(true) { error in
        if let error = error as? ENError, error.code == .notAuthorized {
          callback([String.notAuthorized])
        } else if let error = error {
          callback([error.localizedDescription])
        } else {
          callback([String.authorized])
        }
    }
  }
}
