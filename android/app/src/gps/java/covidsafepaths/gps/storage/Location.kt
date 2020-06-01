package covidsafepaths.gps.storage

import android.util.Log
import com.facebook.react.bridge.*
import com.marianhello.bgloc.data.BackgroundLocation
import io.realm.RealmObject
import io.realm.RealmList
import io.realm.annotations.PrimaryKey
import covidsafepaths.gps.extensions.scryptHashes
import java.lang.Exception
import kotlin.math.abs
import kotlin.math.acos
import kotlin.math.cos
import kotlin.math.sin

private fun List<String>.toWritableArray(): WritableArray =
  fold(WritableNativeArray()) { array, str ->
    array.pushString(str)
    array
  }

private fun <T> List<T>.toRealmList(): RealmList<T> =
  fold(RealmList<T>()) { dst, str ->
    dst.add(str)
    dst
  }

/*
  Realm requires a no-op constructor. Need to use var and fill will default value
 */
open class Location(
  @PrimaryKey var time: Long = 0,
  var latitude: Double = 0.0,
  var longitude: Double = 0.0,
  var altitude: Double? = null,
  var speed: Float? = null,
  var accuracy: Float? = null,
  var bearing: Float? = null,
  var provider: String? = null,
  var hashes: RealmList<String>? = null,
  var mockFlags: Int? = null,
  var source: Int = -1
) : RealmObject() {

  fun toWritableMap(): WritableMap {
    return WritableNativeMap().apply {
      putDouble(KEY_TIME, time.toDouble())
      putDouble(KEY_LATITUDE, latitude)
      putDouble(KEY_LONGITUDE, longitude)
      hashes?.let { putArray(KEY_HASHES, it.toWritableArray()) }
    }
  }

  companion object {
    const val KEY_TIME = "time"
    const val KEY_LATITUDE = "latitude"
    const val KEY_LONGITUDE = "longitude"
    const val KEY_SOURCE = "source"
    const val KEY_HASHES = "hashes"

    const val SOURCE_DEVICE = 0
    const val SOURCE_MIGRATION = 1
    const val SOURCE_GOOGLE = 2
    const val SOURCE_ASSUMED = 3

    fun fromBackgroundLocation(backgroundLocation: BackgroundLocation): Location {
      return Location(
          time = backgroundLocation.time,
          latitude = backgroundLocation.latitude,
          longitude = backgroundLocation.longitude,
          altitude = if (backgroundLocation.hasAltitude()) backgroundLocation.altitude else null,
          speed = if (backgroundLocation.hasSpeed()) backgroundLocation.speed else null,
          accuracy = if (backgroundLocation.hasAccuracy()) backgroundLocation.accuracy else null,
          bearing = if (backgroundLocation.hasBearing()) backgroundLocation.bearing else null,
          provider = backgroundLocation.provider,
          hashes = backgroundLocation.scryptHashes().toRealmList(),
          mockFlags = backgroundLocation.mockFlags,
          source = SOURCE_DEVICE
      )
    }

    fun fromImportLocation(
      map: ReadableMap?,
      source: Int
    ): Location? {
      return try {
        if (map == null) return null
        val time = when(map.getType(KEY_TIME)){
          ReadableType.Number -> map.getDouble(KEY_TIME).toLong()
          ReadableType.String -> map.getString(KEY_TIME)?.toLong()
          else -> null
        }
        val latitude = map.getDouble(KEY_LATITUDE)
        val longitude = map.getDouble(KEY_LONGITUDE)

        if (time == null || latitude == 0.0 || longitude == 0.0) {
          return null
        }

        return Location(
            time = time,
            latitude = latitude,
            longitude = longitude,
            source = source
        )
      } catch (exception: Exception) {
        Log.d("Location", "Failed to import location. Received unexpected payload from bridge.")
        // possible react type-safe issues here
        null
      }
    }

    fun createAssumedLocation(time: Long, latitude: Double, longitude: Double): Location {
      return Location(
          time = time,
          latitude = latitude,
          longitude = longitude,
          source = SOURCE_ASSUMED
      )
    }

    fun areLocationsNearby(lat1: Double, lon1: Double, lat2: Double, lon2: Double): Boolean {
      val nearbyDistance = 20 // in meters, anything closer is "nearby"

      // these numbers from https://en.wikipedia.org/wiki/Decimal_degrees
      val notNearbyInLatitude = 0.00017966 // = nearbyDistance / 111320
      val notNearbyInLongitude23Lat = 0.00019518 // = nearbyDistance / 102470
      val notNearbyInLongitude45Lat = 0.0002541 // = nearbyDistance / 78710
      val notNearbyInLongitude67Lat = 0.00045981 // = nearbyDistance / 43496

      val deltaLon = lon2 - lon1

      // Initial checks we can do quickly.  The idea is to filter out any cases where the
      //   difference in latitude or the difference in longitude must be larger than the
      //   nearby distance, since this can be calculated trivially.
      if (abs(lat2 - lat1) > notNearbyInLatitude) return false
      if (abs(lat1) < 23) {
        if (abs(deltaLon) > notNearbyInLongitude23Lat) return false
      } else if (abs(lat1) < 45) {
        if (abs(deltaLon) > notNearbyInLongitude45Lat) return false
      } else if (abs(lat1) < 67) {
        if (abs(deltaLon) > notNearbyInLongitude67Lat) return false
      }

      // Close enough to do a detailed calculation.  Using the the Spherical Law of Cosines method.
      //    https://www.movable-type.co.uk/scripts/latlong.html
      //    https://en.wikipedia.org/wiki/Spherical_law_of_cosines
      //
      // Calculates the distance in meters
      val p1 = (lat1 * Math.PI) / 180
      val p2 = (lat2 * Math.PI) / 180
      val deltaLambda = (deltaLon * Math.PI) / 180
      val R = 6371e3; // gives d in metres
      val d =
        acos(
            sin(p1) * sin(p2) +
                cos(p1) * cos(p2) * cos(deltaLambda)
        ) * R

      // closer than the "nearby" distance?
      if (d < nearbyDistance) return true

      // nope
      return false
    }
  }
}