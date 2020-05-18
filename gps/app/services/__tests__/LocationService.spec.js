import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import AsyncStorage from '@react-native-community/async-storage';
import { NativeModules } from 'react-native';

import { CROSSED_PATHS, PARTICIPATE } from '../../constants/storage';
import { Reason } from '../LocationService';
import LocationServices from '../LocationService';

jest.mock('@mauron85/react-native-background-geolocation');

function mockBackgroundGeolocationCheckStatus(data) {
  BackgroundGeolocation.checkStatus.mockImplementation(callback => {
    callback(data);
  });
}

// This is not great, but its clearer than mockOnce().mockOnce().mockOnce()
const storage = {};

function resetStorage() {
  Object.keys(storage).forEach(k => delete storage[k]);
}

beforeEach(() => {
  resetStorage();
  jest.resetAllMocks();
  AsyncStorage.getItem.mockImplementation(key => storage[key]);
});

describe('LocationData class', () => {
  let locationData;

  beforeEach(() => {
    NativeModules.SecureStorageManager.getLocations.mockResolvedValue([
      1,
      2,
      3,
      4,
      5,
    ]);
    let { LocationData } = require('../LocationService');
    locationData = new LocationData();
  });

  it('has the correct time interval', () => {
    expect(locationData.locationInterval).toBe(60000 * 5);
  });

  it('parses the location data', async () => {
    const data = await locationData.getLocationData();

    expect(data.length).toBe(5);
  });
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

  describe('getParticpating', () => {
    it('return true when location tracking is on', async () => {
      AsyncStorage.getItem.mockResolvedValueOnce(true);
      const data = await LocationServices.getParticpating();
      expect(data).toBe(true);
    });

    it('return false when location tracking is on', async () => {
      AsyncStorage.getItem.mockResolvedValueOnce(false);
      const data = await LocationServices.getParticpating();
      expect(data).toBe(false);
    });
  });

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

    it('return USER_OFF when particpating is false', async () => {
      storage[CROSSED_PATHS] = '[0, 0, 0]';
      storage[PARTICIPATE] = 'false';

      mockBackgroundGeolocationCheckStatus({
        locationServicesEnabled: true,
        authorization: BackgroundGeolocation.AUTHORIZED,
      });

      const data = await LocationServices.checkStatus();

      expect(data).toEqual({
        canTrack: false,
        reason: Reason.USER_OFF,
        hasPotentialExposure: false,
      });
    });

    it('return LOCATION_OFF when location services are off', async () => {
      storage[CROSSED_PATHS] = '[0, 0, 0]';
      storage[PARTICIPATE] = 'true';
      mockBackgroundGeolocationCheckStatus({
        locationServicesEnabled: false,
      });

      const data = await LocationServices.checkStatus();
      expect(data).toEqual({
        canTrack: false,
        reason: Reason.LOCATION_OFF,
        hasPotentialExposure: false,
      });
    });

    it('return NOT_AUTHORIZED when BackgroundGeoStatus authorization is NOT_AUTHORIZED ', async () => {
      storage[CROSSED_PATHS] = '[0, 0, 0]';
      storage[PARTICIPATE] = 'true';
      mockBackgroundGeolocationCheckStatus({
        locationServicesEnabled: true,
        authorization: BackgroundGeolocation.NOT_AUTHORIZED,
      });

      const data = await LocationServices.checkStatus();
      expect(data).toEqual({
        canTrack: false,
        reason: Reason.NOT_AUTHORIZED,
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
        reason: '',
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
        reason: '',
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
        reason: '',
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
      authorization: BackgroundGeolocation.NOT_AUTHORIZED,
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
