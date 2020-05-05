import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';

import * as General from '../../helpers/General';
import { LocationData, Reason } from '../LocationService';
import LocationServices from '../LocationService';

function mockGetStoreData(data) {
  General.GetStoreData = () => {
    return new Promise(resolve => {
      process.nextTick(() => resolve(data));
    });
  };
}

jest.mock('@mauron85/react-native-background-geolocation');

function mockBackgroundGeolocationCheckStatus(data) {
  BackgroundGeolocation.checkStatus.mockImplementation(callback => {
    Promise.resolve().then(callback(data));
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

describe('LocationData class', () => {
  let locationData;

  beforeEach(() => {
    locationData = new LocationData();
  });

  it('has the correct time interval', () => {
    expect(locationData.locationInterval).toBe(60000 * 5);
  });

  it('parses the location data', async () => {
    mockGetStoreData('[1,2,3,4,5]');

    const data = await locationData.getLocationData();

    expect(data.length).toBe(5);
  });

  it('parses the location data point stats', async () => {
    mockGetStoreData('[2,4,6,8,10]');

    const data = await locationData.getPointStats();

    expect(data.firstPoint).toBe(2);
    expect(data.lastPoint).toBe(10);
    expect(data.pointCount).toBe(5);
  });
});

describe('LocationServices class', () => {
  it('getHasPotentialExposure is false because dayBin in null', async () => {
    mockGetStoreData(null);
    const data = await LocationServices.getHasPotentialExposure();
    expect(data).toBe(false);
  });

  it('getParticpating is true', async () => {
    mockGetStoreData(true);
    const data = await LocationServices.getParticpating();
    expect(data).toBe(true);
  });

  it('getBackgroundGeoStatus', async () => {
    let status = {
      locationServicesEnabled: false,
    };
    mockBackgroundGeolocationCheckStatus(status);
    const data = await LocationServices.getBackgroundGeoStatus();
    expect(data).toBe(status);
  });

  describe('LocationServices checkStatus tests', () => {
    it('particpating and potential exposure false', async () => {
      mockGetHasPotentialExposure(false);
      mockGetParticpating(false);
      const data = await LocationServices.checkStatus();

      expect(data).toEqual({
        canTrack: false,
        reason: Reason.USER_OFF,
        hasPotentialExposure: false,
      });
    });

    it('locationServicesEnabled off', async () => {
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

    it('application not authorized', async () => {
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

    it('authorized no exposure', async () => {
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

    it('authorized yes exposure', async () => {
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
