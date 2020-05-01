import * as ReactNative from 'react-native';

describe('LocationData class', () => {
  let locationData;

  beforeEach(() => {
    jest.doMock('react-native', () => {
      return {
        Platform: {
          OS: 'ios',
        },
        NativeModules: {
          ...ReactNative.NativeModules,
          SecureStorageManager: {
            getLocations: jest
              .fn()
              .mockReturnValue(Promise.resolve([1, 2, 3, 4, 5])),
          },
        },
      };
    });
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
