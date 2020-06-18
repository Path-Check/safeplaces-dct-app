#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

// Notification/Event Names
NSString *const onEnabledStatusUpdated = @"onEnabledStatusUpdated";
NSString *const onExposuresChanged = @"onExposureRecordUpdated";

@interface ExposureEventEmitter : RCTEventEmitter <RCTBridgeModule>
@end

@implementation ExposureEventEmitter

+ (BOOL)requiresMainQueueSetup
{
  return YES;  // only do this if your module initialization relies on calling UIKit!
}

RCT_EXPORT_MODULE();

- (instancetype)init
{
  self = [super init];
  if (self) {
    [self startObserving];
  }
  return self;
}


- (NSArray<NSString *> *)supportedEvents {
  return @[
    onExposuresChanged,
    onEnabledStatusUpdated
  ];
}

- (void)startObserving {
  [self stopObserving];
  for (NSString *event in [self supportedEvents]) {
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(handleNotification:)
                                                 name:event
                                               object:nil];
  }
}

- (void)stopObserving {
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

# pragma mark Private

- (void)handleNotification:(NSNotification *)notification {

  [self sendEventWithName:notification.name body: notification.object];

}

@end
