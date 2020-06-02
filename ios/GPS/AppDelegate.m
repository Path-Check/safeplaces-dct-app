/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <RNCPushNotificationIOS.h>
#import <UserNotifications/UserNotifications.h>
#import <RNSplashScreen.h>
#import <TSBackgroundFetch/TSBackgroundFetch.h>
#import <MAURLocation.h>
#import <MAURBackgroundGeolocationFacade.h>
#import <GPS-Swift.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  MAURBackgroundGeolocationFacade.locationTransform = ^(MAURLocation * location) {
    MAURLocation *locationToInsert = [location copy];
    [[SecureStorage shared] saveDeviceLocationWithBackgroundLocation:locationToInsert];
    
    // nil out location so geolocation library doesn't save in its internval db
    location = nil;
    return location;
  };
  
  [[SecureStorage shared] trimLocations];
  
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"COVIDSafePaths"
                                            initialProperties:nil];

  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];

  UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
  center.delegate = self;

  [RNSplashScreen showSplash:@"LaunchScreen" inRootView:rootView];
  // [REQUIRED] Register BackgroundFetch
    [[TSBackgroundFetch sharedInstance] didFinishLaunching];
  return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

// Required to register for notifications
- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings
{
 [RNCPushNotificationIOS didRegisterUserNotificationSettings:notificationSettings];
}
// Required for the register event.
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
 [RNCPushNotificationIOS didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}
// Required for the notification event. You must call the completion handler after handling the remote notification.
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{
  [RNCPushNotificationIOS didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
}
// Required for the registrationError event.
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
 [RNCPushNotificationIOS didFailToRegisterForRemoteNotificationsWithError:error];
}
// Required for the localNotification event.
- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification
{
 [RNCPushNotificationIOS didReceiveLocalNotification:notification];
}

-(BOOL) isFirstTimeClosing {
  //Show local notifiation at first time only.
  if(![[NSUserDefaults standardUserDefaults] boolForKey:@"cxfed_NotificationAtFirstTimeOnly"]) {
    [[NSUserDefaults standardUserDefaults] setBool:YES forKey:@"cxfed_NotificationAtFirstTimeOnly"];
    [[NSUserDefaults standardUserDefaults] synchronize];
    return TRUE;
  }
  return FALSE;
}

-(BOOL) hasNotificationPermissions {
  //Checking local notification permission or not.
  UIUserNotificationSettings *grantedSettings = [[UIApplication sharedApplication] currentUserNotificationSettings];
  if (grantedSettings.types != UIUserNotificationTypeNone){
    return TRUE;
  }
  return FALSE;
}

-(void) notifThatWeAreStillTracking {
  // Set local notification.
  UILocalNotification *_localNotification = [[UILocalNotification alloc] init];
  _localNotification.fireDate = [NSDate dateWithTimeIntervalSinceNow:5];
  _localNotification.timeZone = [NSTimeZone defaultTimeZone];
  _localNotification.alertTitle = NSLocalizedString(@"ios.app_closed_alert_title", @"Title of notification when app is closed");
  _localNotification.alertBody = NSLocalizedString(@"ios.app_closed_alert_text", @"Body text of notification when app is closed");
  _localNotification.soundName = UILocalNotificationDefaultSoundName;
  [[UIApplication sharedApplication]scheduleLocalNotification:_localNotification];
}

- (void)applicationWillTerminate:(UIApplication *)application {
  if([self isFirstTimeClosing] && [self hasNotificationPermissions]) {
    // Show local notification at first time only when app quit.
    [self notifThatWeAreStillTracking];
  }
}

-(void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler
{
  completionHandler(UNAuthorizationOptionSound | UNAuthorizationOptionAlert | UNAuthorizationOptionBadge);
}

@end
