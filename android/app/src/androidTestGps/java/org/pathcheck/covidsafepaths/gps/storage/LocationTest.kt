package org.pathcheck.covidsafepaths.gps.storage

import covidsafepaths.gps.storage.Location
import org.junit.Assert.*
import org.junit.Test

class LocationTest {

  @Test
  fun northAndSouthPolesNotNearby() {
    assertFalse(Location.areLocationsNearby(90.0, 0.0, -90.0, 0.0))
  }

  @Test
  fun newYorkAndSydneyNotNearby() {
    assertFalse(Location.areLocationsNearby(40.7128, -74.006, -33.8688, 151.2093))
  }

  @Test
  fun spotsInKansasCityAreNearby() {
    assertTrue(Location.areLocationsNearby(39.09772, -94.582959, 39.097769, -94.582937))
  }
}