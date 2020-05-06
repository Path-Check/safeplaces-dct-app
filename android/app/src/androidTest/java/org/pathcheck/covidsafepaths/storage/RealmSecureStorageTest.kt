package org.pathcheck.covidsafepaths.storage

import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeArray
import com.facebook.react.bridge.WritableNativeMap
import com.marianhello.bgloc.data.BackgroundLocation
import io.realm.Realm
import io.realm.kotlin.where
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Assert.fail
import org.junit.Before
import org.junit.Test
import java.util.Calendar
import java.util.concurrent.CountDownLatch
import java.util.concurrent.TimeUnit.SECONDS

class RealmSecureStorageTest {

  lateinit var secureStorage: RealmSecureStorage
  private var hold: Realm? = null

  @Before
  fun setUp() {
    secureStorage = RealmSecureStorage(inMemory = true)
    // need to hold on to an instance to keep in memory db open until teardown
    hold = secureStorage.getRealmInstance()
  }

  @After
  fun tearDown() {
    hold = null
  }

  @Test
  fun saveDeviceLocations() {
    // given
    val location1Time = System.currentTimeMillis()
    val backgroundLocation1 = BackgroundLocation().apply {
      latitude = 40.730610
      longitude = -73.935242
      time = location1Time
    }

    // when
    secureStorage.saveDeviceLocation(backgroundLocation1)

    // then
    querySingleLocationByTime(location1Time)?.let {
      assertEquals(40.730610, it.latitude, 0.0)
      assertEquals(-73.935242, it.longitude, 0.0)
      assertEquals(location1Time, it.time)
      assertEquals(Location.SOURCE_DEVICE, it.source)
    } ?: fail("Result Location 1 returned null")
  }

  @Test
  fun saveDeviceLocationsIgnoredIfPreviousInsertTooClose() {
    // given
    val location1Time = System.currentTimeMillis()
    val backgroundLocation1 = BackgroundLocation().apply {
      latitude = 40.730610
      longitude = -73.935242
      time = location1Time
    }
    val location2Time = location1Time + 10
    val backgroundLocation2 = BackgroundLocation().apply {
      latitude = 40.730610
      longitude = -73.935242
      time = location2Time
    }

    // when
    secureStorage.saveDeviceLocation(backgroundLocation1)
    secureStorage.saveDeviceLocation(backgroundLocation2)

    // then
    assertNotNull(querySingleLocationByTime(location1Time))
    assertNull(querySingleLocationByTime(location2Time))
  }

  @Test
  fun importSuccessIfNewerThanMinimum() {
    // given
    val promiseLatch = CountDownLatch(1)
    val promise = object : TestPromise() {
      override fun resolve(value: Any?) {
        super.resolve(value)
        promiseLatch.countDown()
      }
    }
    val location1Time = System.currentTimeMillis()
    val location1 = createWritableMapLocation(latitude = 40.730610, longitude = -73.935242, time = location1Time)
    val location2Time = System.currentTimeMillis() + 10
    val location2 = createWritableMapLocation(latitude = 37.773972, longitude = -122.431297, time = location2Time)
    val locations = WritableNativeArray().apply {
      pushMap(location1)
      pushMap(location2)
    }

    // when
    secureStorage.importLocations(locations = locations, source = Location.SOURCE_GOOGLE, promise = promise)

    // then
    querySingleLocationByTime(location1Time)?.let {
      assertEquals(40.730610, it.latitude, 0.0)
      assertEquals(-73.935242, it.longitude, 0.0)
      assertEquals(location1Time, it.time)
      assertEquals(Location.SOURCE_GOOGLE, it.source)
    } ?: fail("Result Location 1 returned null")

    querySingleLocationByTime(location2Time)?.let {
      assertEquals(37.773972, it.latitude, 0.0)
      assertEquals(-122.431297, it.longitude, 0.0)
      assertEquals(location2Time, it.time)
      assertEquals(Location.SOURCE_GOOGLE, it.source)
    } ?: fail("Result Location 2 returned null")

    assertTrue(promiseLatch.await(1, SECONDS))
  }

  @Test
  fun importSuccessFromGoogle() {
    // given
    val location1Time = System.currentTimeMillis()
    val location1 = createWritableMapLocation(latitude = 40.730610, longitude = -73.935242, time = location1Time)
    val locations = WritableNativeArray().apply {
      pushMap(location1)
    }

    // when
    secureStorage.importLocations(locations = locations, source = Location.SOURCE_GOOGLE, promise = TestPromise())

    // then
    querySingleLocationByTime(location1Time)?.let {
      assertEquals(Location.SOURCE_GOOGLE, it.source)
    } ?: fail("Result Location 1 returned null")
  }

  @Test
  fun importSuccessFromMigration() {
    // given
    val location1Time = System.currentTimeMillis()
    val location1 = createWritableMapLocation(latitude = 40.730610, longitude = -73.935242, time = location1Time)
    val locations = WritableNativeArray().apply {
      pushMap(location1)
    }

    // when
    secureStorage.importLocations(locations = locations, source = Location.SOURCE_MIGRATION, promise = TestPromise())

    // then
    querySingleLocationByTime(location1Time)?.let {
      assertEquals(Location.SOURCE_MIGRATION, it.source)
    } ?: fail("Result Location 1 returned null")
  }

  @Test
  fun importFailsIfLocationOlderThanMinimum() {
    // given
    val calendar = Calendar.getInstance()
    calendar.add(Calendar.DAY_OF_YEAR, -15)
    val location1Time =calendar.timeInMillis
    val location1 = createWritableMapLocation(latitude = 1.0, longitude = 1.0, time = location1Time)
    val location2Time = System.currentTimeMillis()
    val location2 = createWritableMapLocation(latitude = 1.0, longitude = 1.0, time = location2Time)
    val locations = WritableNativeArray().apply {
      pushMap(location1)
      pushMap(location2)
    }

    // when
    secureStorage.importLocations(locations = locations, source = Location.SOURCE_GOOGLE, promise = TestPromise())

    // then
    assertNull(querySingleLocationByTime(location1Time))
    assertNotNull(querySingleLocationByTime(location2Time))
  }

  @Test
  fun getLocationsReturnsSortedAndFilters() {
    // given
    val calendar = Calendar.getInstance()
    calendar.add(Calendar.DAY_OF_YEAR, -15)
    val location1Time = calendar.timeInMillis
    val backgroundLocation1 = BackgroundLocation().apply {
      latitude = 40.730610
      longitude = -73.935242
      time = location1Time
    }
    val location2Time = System.currentTimeMillis()
    val backgroundLocation2 = BackgroundLocation().apply {
      latitude = 40.730610
      longitude = -73.935242
      time = location2Time
    }
    val location3Time = location2Time - 10
    val location3 = createWritableMapLocation(latitude = 37.773972, longitude = -122.431297, time = location3Time)
    val importLocations = WritableNativeArray().apply {
      pushMap(location3)
    }
    val promiseLatch = CountDownLatch(1)
    val promise = object : TestPromise() {
      override fun resolve(value: Any?) {
        super.resolve(value)
        // then
        assertEquals(2, (value as? ReadableArray)?.size() ?: 0)
        (value as? ReadableArray)?.getMap(0)?.let {
          assertEquals(location3Time.toDouble(), it.getDouble(Location.KEY_TIME), 0.0)
        } ?: fail("Result at index 0 was null")
        (value as? ReadableArray)?.getMap(1)?.let {
          assertEquals(location2Time.toDouble(), it.getDouble(Location.KEY_TIME), 0.0)
        } ?: fail("Result at index 0 was null")
        promiseLatch.countDown()
      }
    }
    secureStorage.saveDeviceLocation(backgroundLocation1)
    secureStorage.saveDeviceLocation(backgroundLocation2)
    secureStorage.importLocations(locations = importLocations, source = Location.SOURCE_GOOGLE, promise = TestPromise())

    // when
    secureStorage.getLocations(promise)

    // then
    assertTrue(promiseLatch.await(1, SECONDS))
  }

  @Test
  fun oldLocationsTrimmed() {
    // given
    val calendar = Calendar.getInstance()
    calendar.add(Calendar.DAY_OF_YEAR, -15)
    val location1Time =calendar.timeInMillis
    val backgroundLocation1 = BackgroundLocation().apply {
      latitude = 40.730610
      longitude = -73.935242
      time = location1Time
    }
    val calendar2 = Calendar.getInstance()
    calendar2.add(Calendar.DAY_OF_YEAR, -13)
    val location2Time =calendar2.timeInMillis
    val backgroundLocation2 = BackgroundLocation().apply {
      latitude = 40.730610
      longitude = -73.935242
      time = location2Time
    }
    secureStorage.saveDeviceLocation(backgroundLocation1)
    secureStorage.saveDeviceLocation(backgroundLocation2)

    // when
    secureStorage.trimLocations()

    // then
    assertNull(querySingleLocationByTime(location1Time))
    assertNotNull(querySingleLocationByTime(location2Time))
  }

  private fun createWritableMapLocation(latitude: Double, longitude: Double, time: Long): WritableMap {
    return WritableNativeMap().apply {
      putDouble("latitude", latitude)
      putDouble("longitude", longitude)
      putDouble("time", time.toDouble())
    }
  }

  private fun querySingleLocationByTime(time: Long): Location? {
    return secureStorage.getRealmInstance().where<Location>().equalTo(Location.KEY_TIME, time).findFirst()
  }
}