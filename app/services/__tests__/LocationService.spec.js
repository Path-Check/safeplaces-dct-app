import * as General from '../../helpers/General';
import { LocationData } from '../LocationService';

function mockGetStoreData(data) {
  General.GetStoreData = () => {
    return new Promise(resolve => {
      process.nextTick(() => resolve(data));
    });
  };
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
