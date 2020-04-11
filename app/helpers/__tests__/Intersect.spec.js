import { isLocationsNearby } from '../Intersect';

describe('isLocationsNearby', () => {

  // simple tests for the isLocationNearby function

  it('north and south poles not nearby',() => {
      expect(isLocationsNearby(90,0,-90,0)).toBe(false);
  });

  it('New York and Sydney are not nearby',() => {
    expect(isLocationsNearby(40.7128,-74.0060,-33.8688,151.2093)).toBe(false);
  });

  it('two spots in Kansas City are nearby',() => {
    expect(isLocationsNearby(39.097720,-94.582959,39.097769,-94.582937)).toBe(true);
  });

})
