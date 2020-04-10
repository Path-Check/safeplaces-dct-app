import { makeTimelineObject } from './GoogleTakeoutUtils';
const { location2, location3, location4 } = require('./fixtures/googleImport');

const GOOGLE_IMPORT = {
  timelineObjects: [
    makeTimelineObject(location2),
    makeTimelineObject(location3),
    makeTimelineObject(location4),
  ],
};

describe('mergeJSONWithLocalData', () => {
  beforeEach(() => jest.resetModules());

  it('LOCATION_DATA is empty', async () => {
    jest.doMock('../../helpers/General', () => {
      return {
        GetStoreData: async () => {},
        SetStoreData: async () => {},
      };
    });

    const { mergeJSONWithLocalData } = require('../GoogleData');
    const newLocations = await mergeJSONWithLocalData(GOOGLE_IMPORT);

    expect(newLocations).toEqual([location2, location3, location4]);
  });
  it('LOCATION_DATA contains location values', async () => {
    jest.doMock('../../helpers/General', () => {
      const {
        location1,
        location2,
        location3,
      } = require('./fixtures/googleImport');

      return {
        GetStoreData: async () => [location1, location2, location3],
        SetStoreData: async () => {},
      };
    });

    const { mergeJSONWithLocalData } = require('../GoogleData');

    const newLocations = await mergeJSONWithLocalData(GOOGLE_IMPORT);
    expect(newLocations).toEqual([location4]);
  });
});
