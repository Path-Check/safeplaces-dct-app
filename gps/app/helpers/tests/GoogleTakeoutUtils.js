export function makeTimelineObject(location) {
  return {
    placeVisit: {
      location: {
        latitudeE7: Math.round(location.latitude * 10 ** 7),
        longitudeE7: Math.round(location.longitude * 10 ** 7),
      },
      duration: {
        startTimestampMs: location.time,
        endTimestampMs: '1586283656999',
      },
    },
  };
}
