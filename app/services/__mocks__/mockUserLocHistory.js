export const mockNullUserLocHistory = [
  {
    latitude: 0,
    longitude: 0,
    time: 0,
  },
];

export const mockUserLocHistory = [
  {
    latitude: 38.421998333333335,
    longitude: -123.08400000000002,
    time: 1586714348000,
  },
  {
    latitude: 37.421998333333335,
    longitude: -122.08400000000002,
    time: 1586145111983,
  },
];

export const mockNullMostRecentUserLoc = mockNullUserLocHistory[0];

export const mockMostRecentUserLoc =
  mockUserLocHistory[mockUserLocHistory.length - 1];
