import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import AsyncStorage from '@react-native-community/async-storage';
import { NativeModules } from 'react-native';

import { Reason } from '../LocationService';
import LocationServices from '../LocationService';

jest.mock('@mauron85/react-native-background-geolocation');

function mockBackgroundGeolocationCheckStatus(data) {
  BackgroundGeolocation.checkStatus.mockImplementation(callback => {
    callback(data);
  });
}

function mockGetHasPotentialExposure(data) {
  jest
    .spyOn(LocationServices, 'getHasPotentialExposure')
    .mockResolvedValueOnce(data);
}

function mockGetParticpating(data) {
  jest.spyOn(LocationServices, 'getParticpating').mockResolvedValueOnce(data);
}

function mockGetBackgroundGeoStatus(data) {
  jest
    .spyOn(LocationServices, 'getBackgroundGeoStatus')
    .mockResolvedValueOnce(data);
}

beforeEach(() => {
  jest.resetAllMocks();
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

describe('LocationServices class', () => {
  describe('getHasPotentialExposure', () => {
    it('return false when dayBin in null', async () => {
      AsyncStorage.getItem.mockResolvedValueOnce(null);
      const data = await LocationServices.getHasPotentialExposure();
      await expect(data).toBe(false);
    });
    it('return true when dayBin has exposure data', async () => {
      AsyncStorage.getItem.mockResolvedValueOnce('[2, 3, 4]');
      const data = await LocationServices.getHasPotentialExposure();
      expect(data).toBe(true);
    });
  });

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

  describe('LocationServices checkStatus tests', () => {
    it('return USER_OFF when particpating is false', async () => {
      mockGetHasPotentialExposure(false);
      mockGetParticpating(false);
      const data = await LocationServices.checkStatus();

      expect(data).toEqual({
        canTrack: false,
        reason: Reason.USER_OFF,
        hasPotentialExposure: false,
      });
    });

    it('return LOCATION_OFF when location services are off', async () => {
      mockGetHasPotentialExposure(false);
      mockGetParticpating(true);
      mockGetBackgroundGeoStatus({
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
      mockGetHasPotentialExposure(false);
      mockGetParticpating(true);
      mockGetBackgroundGeoStatus({
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
      mockGetHasPotentialExposure(false);
      mockGetParticpating(true);
      mockGetBackgroundGeoStatus({
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
      mockGetHasPotentialExposure(true);
      mockGetParticpating(true);
      mockGetBackgroundGeoStatus({
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
  });
});
