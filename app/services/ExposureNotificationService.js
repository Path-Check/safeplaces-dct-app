global.ExposureNotificationsOn = true;

export default class ExposureNotificaionService {
  DEVICE_EXPOSURE_NOTIFICATIONS_OFF = 'DEVICE_EXPOSURE_NOTIFICATIONS_OFF';
  ALL_CONDITIONS_MET = 'ALL_CONDITIONS_MET';

  static async checkStatusAndStartOrStop() {
    console.log('[INFO] EN service check status: ', global.ExposureNoficationsOn);
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
