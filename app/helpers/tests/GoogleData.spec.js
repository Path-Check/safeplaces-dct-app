import { makeTimelineObject } from './GoogleTakeoutUtils';
const { location2, location3, location4 } = require('./fixtures/googleImport');

const GOOGLE_IMPORT = {
  timelineObjects: [
    makeTimelineObject(location2),
    makeTimelineObject(location3),
    makeTimelineObject(location4),
  ],
};

describe('extract google locations', () => {
  beforeEach(() => jest.resetModules());

  it('extract locations into an array', async () => {
    const { extractLocations } = require('../GoogleData');

    const newLocations = await extractLocations(GOOGLE_IMPORT);
    expect(newLocations).toEqual([location2, location3, location4]);
  });
});
