package org.pathcheck.covidsafepaths.storage

import android.util.Log
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.ReadableType
import com.marianhello.bgloc.data.BackgroundLocation
import io.realm.RealmObject
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeMap
import io.realm.annotations.PrimaryKey
import java.lang.Exception

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
  var mockFlags: Int? = null,
  var source: Int = -1
) : RealmObject() {

  fun toWritableMap(): WritableMap {
    val writableMap = WritableNativeMap()
    writableMap.putDouble(KEY_TIME, time.toDouble())
    writableMap.putDouble(KEY_LATITUDE, latitude)
    writableMap.putDouble(KEY_LONGITUDE, longitude)
    return writableMap
  }

  companion object {
    const val KEY_TIME = "time"
    const val KEY_LATITUDE = "latitude"
    const val KEY_LONGITUDE = "longitude"
    const val KEY_SOURCE = "source"

    const val SOURCE_DEVICE = 0
    const val SOURCE_MIGRATION = 1
    const val SOURCE_GOOGLE = 2

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
  }
}