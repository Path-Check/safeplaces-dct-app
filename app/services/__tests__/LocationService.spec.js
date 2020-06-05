import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import AsyncStorage from '@react-native-community/async-storage';
import { NativeModules } from 'react-native';

import { CROSSED_PATHS, PARTICIPATE } from '../../constants/storage';
import LocationServices, {
  MIN_LOCATION_UPDATE_MS,
  Reason,
} from '../LocationService';

jest.mock('@mauron85/react-native-background-geolocation');

function mockBackgroundGeolocationCheckStatus(data) {
  BackgroundGeolocation.checkStatus.mockImplementation((callback) => {
    callback(data);
  });
}

// This is not great, but its clearer than mockOnce().mockOnce().mockOnce()
const storage = {};

function resetStorage() {
  Object.keys(storage).forEach((k) => delete storage[k]);
}

beforeEach(() => {
  resetStorage();
  jest.resetAllMocks();
  AsyncStorage.getItem.mockImplementation((key) => storage[key]);
});

it('has the correct time interval', () => {
  expect(MIN_LOCATION_UPDATE_MS).toBe(60000 * 5);
});

it('parses the location data', async () => {
  NativeModules.SecureStorageManager.getLocations.mockResolvedValue([
    1,
    2,
    3,
    4,
    5,
  ]);

  const data = await LocationServices.getLocationData();

  expect(data.length).toBe(5);
});

describe('LocationServices', () => {
  describe('getHasPotentialExposure', () => {
    it('return false when dayBin in null', async () => {
      storage[CROSSED_PATHS] = null;
      const data = await LocationServices.getHasPotentialExposure();
      await expect(data).toBe(false);
    });

    it('return true when dayBin has exposure data', async () => {
      storage[CROSSED_PATHS] = '[2, 3, 4]';
      const data = await LocationServices.getHasPotentialExposure();
      expect(data).toBe(true);
    });
  }); // getHasPotentialExposure

  describe('getBackgroundGeoStatus', () => {
    it('return status based on phone location permissions', async () => {
      let status = {
        locationServicesEnabled: false,
      };
      mockBackgroundGeolocationCheckStatus(status);
      const data = await LocationServices.getBackgroundGeoStatus();
      expect(data).toBe(status);
    });
  });

  describe('checkStatus', () => {
    it('passes through isRunning state', async () => {
      storage[CROSSED_PATHS] = '[0, 0, 0]';
      storage[PARTICIPATE] = 'true';

      mockBackgroundGeolocationCheckStatus({
        locationServicesEnabled: true,
        authorization: BackgroundGeolocation.AUTHORIZED,
        isRunning: 'blah',
      });

      const data = await LocationServices.checkStatus();

      expect(data).toEqual(
        expect.objectContaining({
          isRunning: 'blah',
        }),
      );
    });

    it('return DEVICE_LOCATION_OFF when location services are off', async () => {
      storage[CROSSED_PATHS] = '[0, 0, 0]';
      storage[PARTICIPATE] = 'true';
      mockBackgroundGeolocationCheckStatus({
        locationServicesEnabled: false,
      });

      const data = await LocationServices.checkStatus();
      expect(data).toEqual({
        canTrack: false,
        reason: Reason.DEVICE_LOCATION_OFF,
        hasPotentialExposure: false,
      });
    });

    it('return APP_NOT_AUTHORIZED when BackgroundGeoStatus authorization is NOT_AUTHORIZED ', async () => {
      storage[CROSSED_PATHS] = '[0, 0, 0]';
      storage[PARTICIPATE] = 'true';
      mockBackgroundGeolocationCheckStatus({
        locationServicesEnabled: true,
        authorization: BackgroundGeolocation.NOT_AUTHORIZED,
      });

      const data = await LocationServices.checkStatus();
      expect(data).toEqual({
        canTrack: false,
        reason: Reason.APP_NOT_AUTHORIZED,
        hasPotentialExposure: false,
      });
    });

    it('return canTrack true when particpating is true and BackgroundGeolocation is AUTHORIZED', async () => {
      storage[CROSSED_PATHS] = '[0, 0, 0]';
      storage[PARTICIPATE] = 'true';
      mockBackgroundGeolocationCheckStatus({
        locationServicesEnabled: true,
        authorization: BackgroundGeolocation.AUTHORIZED,
      });
      const data = await LocationServices.checkStatus();
      expect(data).toEqual({
        canTrack: true,
        reason: Reason.ALL_CONDITIONS_MET,
        hasPotentialExposure: false,
      });
    });

    it('return canTrack true and hasPotentialExposure true when BackgroundGeolocation AUTHORIZED', async () => {
      storage[CROSSED_PATHS] = '[0, 0, 0, 5]';
      storage[PARTICIPATE] = 'true';
      mockBackgroundGeolocationCheckStatus({
        locationServicesEnabled: true,
        authorization: BackgroundGeolocation.AUTHORIZED,
      });
      const data = await LocationServices.checkStatus();
      expect(data).toEqual({
        canTrack: true,
        reason: Reason.ALL_CONDITIONS_MET,
        hasPotentialExposure: true,
      });
    });
  }); // checkStatus

  describe('checkStatusAndStartOrStop', () => {
    const CAN_TRACK = {
      locationServicesEnabled: true,
      authorization: BackgroundGeolocation.AUTHORIZED,
    };

    it('passes through the checkStatus info', async () => {
      storage[CROSSED_PATHS] = '[0, 0, 0]';
      storage[PARTICIPATE] = 'true';

      mockBackgroundGeolocationCheckStatus({
        ...CAN_TRACK,
        isRunning: true,
      });

      const status = await LocationServices.checkStatusAndStartOrStop();

      expect(status).toEqual({
        canTrack: true,
        hasPotentialExposure: false,
        isRunning: true,
        reason: Reason.ALL_CONDITIONS_MET,
      });
    });

    it('does not start the service if already running', async () => {
      storage[CROSSED_PATHS] = '[0, 0, 0]';
      storage[PARTICIPATE] = 'true';

      mockBackgroundGeolocationCheckStatus({
        ...CAN_TRACK,
        isRunning: true,
      });

      await LocationServices.checkStatusAndStartOrStop();

      expect(BackgroundGeolocation.start).not.toHaveBeenCalled();
    });

    it('starts the service if not running', async () => {
      storage[CROSSED_PATHS] = '[0, 0, 0]';
      storage[PARTICIPATE] = 'true';

      mockBackgroundGeolocationCheckStatus({
        ...CAN_TRACK,
        isRunning: false,
      });

      await LocationServices.checkStatusAndStartOrStop();

      expect(BackgroundGeolocation.start).toHaveBeenCalled();
    });

    const CANNOT_TRACK = {
      locationServicesEnabled: true,
      authorization: BackgroundGeolocation.APP_NOT_AUTHORIZED,
    };

    it('does not stop the service if already stopped', async () => {
      storage[CROSSED_PATHS] = '[0, 0, 0]';
      storage[PARTICIPATE] = 'true';

      mockBackgroundGeolocationCheckStatus({
        ...CANNOT_TRACK,
        isRunning: false,
      });

      await LocationServices.checkStatusAndStartOrStop();

      expect(BackgroundGeolocation.stop).not.toHaveBeenCalled();
    });

    it('stops the service if running', async () => {
      storage[CROSSED_PATHS] = '[0, 0, 0]';
      storage[PARTICIPATE] = 'true';

      mockBackgroundGeolocationCheckStatus({
        ...CANNOT_TRACK,
        isRunning: true,
      });

      await LocationServices.checkStatusAndStartOrStop();

      expect(BackgroundGeolocation.stop).toHaveBeenCalled();
    });
  }); // checkStatusAndStartOrStop
});
