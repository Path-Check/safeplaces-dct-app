export default class ExposureNotificaionService {
  DEVICE_EXPOSURE_NOTIFICATIONS_OFF = 'DEVICE_EXPOSURE_NOTIFICATIONS_OFF';
  ALL_CONDITIONS_MET = 'ALL_CONDITIONS_MET';

  static async checkStatusAndStartOrStop() {
    console.log('[INFO] EN service check status');
    const isDeviceExposureNotificationEnabled = true;

    if (!isDeviceExposureNotificationEnabled) {
      return {
        canTrack: false,
        reason: this.DEVICE_EXPOSURE_NOTIFICATIONS_OFF,
        hasPotentialExposure: false
      };
    }

    return {
      canTrack: true,
      reason: this.ALL_CONDITIONS_MET,
      hasPotentialExposure: false,
    };
  }
}
