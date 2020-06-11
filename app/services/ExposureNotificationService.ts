// eslint-disable-next-line
declare const global: any;

global.ExposureNotificationsOn = true;

type ENStatusReason =
  | 'DEVICE_EXPOSURE_NOTIFICATIONS_OFF'
  | 'ALL_CONDITIONS_MET';

interface ExposureNotificationsState {
  canTrack: boolean;
  reason: ENStatusReason;
  hasPotentialExposure: boolean;
}

export default class ExposureNotificationService {
  public static DEVICE_EXPOSURE_NOTIFICATIONS_OFF: ENStatusReason =
    'DEVICE_EXPOSURE_NOTIFICATIONS_OFF';
  public static ALL_CONDITIONS_MET: ENStatusReason = 'ALL_CONDITIONS_MET';

  static checkStatusAndStartOrStop(): ExposureNotificationsState {
    console.log(
      '[INFO] EN service check status: ',
      global.ExposureNoficationsOn,
    );
    const isDeviceExposureNotificationEnabled = global.ExposureNotificationsOn;

    if (!isDeviceExposureNotificationEnabled) {
      return {
        canTrack: false,
        reason: this.DEVICE_EXPOSURE_NOTIFICATIONS_OFF,
        hasPotentialExposure: false,
      };
    }

    return {
      canTrack: true,
      reason: this.ALL_CONDITIONS_MET,
      hasPotentialExposure: false,
    };
  }
}
