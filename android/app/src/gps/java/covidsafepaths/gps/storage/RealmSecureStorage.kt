// For testing purposes you may need to retrieve data from this encrypted Relm.io database
// Directions on how to export the encryption key and use it to open the database file:
// https://pathcheck.atlassian.net/wiki/spaces/TEST/pages/50824879/Secure+Storage+Testing
// -or-
// https://gist.github.com/troach-sf/f257bb7b80e6dddd4f3bade81b7b1410


package covidsafepaths.gps.storage

import android.util.Base64
import android.util.Log
import androidx.annotation.VisibleForTesting
import com.bottlerocketstudios.vault.SharedPreferenceVault
import com.bottlerocketstudios.vault.SharedPreferenceVaultFactory
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.WritableNativeArray
import com.marianhello.bgloc.data.BackgroundLocation
import io.realm.Realm
import io.realm.RealmConfiguration
import io.realm.Sort.ASCENDING
import io.realm.Sort.DESCENDING
import io.realm.kotlin.where
import covidsafepaths.gps.MainApplication
import covidsafepaths.gps.storage.Location.Companion.areLocationsNearby
import covidsafepaths.gps.storage.Location.Companion.createAssumedLocation
import covidsafepaths.util.getCutoffTimestamp
import java.security.SecureRandom
import java.util.UUID

open class RealmSecureStorage(inMemory: Boolean?) {
  constructor(): this(false)

  companion object {
    private const val TAG = "RealmSecureStorage"
    private const val MINIMUM_TIME_INTERVAL = 60000 * 4
    const val LOCATION_INTERVAL: Long = 60000 * 5
    private const val MAX_BACKFILL_TIME = 60000 * 60 * 24
    private const val DAYS_TO_KEEP = 14
    private const val SCHEMA_VERSION: Long = 1

    private const val MANUALLY_KEYED_PREF_FILE_NAME = "safepaths_enc_prefs"
    private const val MANUALLY_KEYED_KEY_FILE_NAME = "safepaths_enc_key"
    private const val MANUALLY_KEYED_KEY_ALIAS = "safepaths"
    private const val MANUALLY_KEYED_KEY_INDEX = 2
    private const val MANUALLY_KEYED_PRESHARED_SECRET = "" // This will not be used as we do not support < 18
    private const val KEY_REALM_ENCRYPTION_KEY = "KEY_REALM_ENCRYPTION_KEY"
  }

  private val realmConfig: RealmConfiguration

  init {
    val encryptionKey = getEncryptionKey()

    val builder = RealmConfiguration.Builder()
        .encryptionKey(encryptionKey)
        .addModule(SafePathsRealmModule())
        .schemaVersion(SCHEMA_VERSION)
        .migration(Migration())

    if (inMemory != null && inMemory) {
      builder.name(UUID.randomUUID().toString()).inMemory()
    } else {
      builder.name("safepaths.realm")
    }

    realmConfig = builder.build()
  }

  fun saveDeviceLocation(backgroundLocation: BackgroundLocation) {
    val realm = getRealmInstance()

    realm.executeTransaction {
      val realmResult = it.where<Location>()
          .equalTo(Location.KEY_SOURCE, Location.SOURCE_DEVICE)
          .sort(Location.KEY_TIME, DESCENDING)
          .limit(1)
          .findAll()

      val previousLocation = realmResult.getOrNull(0)
      val previousTime = previousLocation?.time ?: 0
      if (backgroundLocation.time - previousTime > MINIMUM_TIME_INTERVAL) {
        val assumedLocations = createAssumedLocations(previousLocation, backgroundLocation)
        if (assumedLocations.isNotEmpty()) {
          Log.d(TAG, "Inserting ${assumedLocations.size} assumed locations")
        }
        it.insert(assumedLocations)
        Log.d(TAG, "Inserting New Location")
        it.insert(Location.fromBackgroundLocation(backgroundLocation))
      } else {
        Log.d(TAG, "Ignoring save. Minimum time threshold not exceeded")
      }
    }

    realm.close()
  }

  fun importLocations(locations: ReadableArray, source: Int, promise: Promise) {
    val realm = getRealmInstance()

    val locationsToInsert = mutableListOf<Location>()
    realm.executeTransaction {
      for (i in 0 until locations.size()) {
        try {
          val map = locations.getMap(i)
          Location.fromImportLocation(map, source)?.let { location ->
            if (location.time >= getCutoffTimestamp(DAYS_TO_KEEP)) {
              locationsToInsert.add(location)
            }
          }
        } catch (exception: Exception) {
          // possible react type-safe issues here
        }
      }
      it.insertOrUpdate(locationsToInsert)
    }

    realm.close()
    promise.resolve(true)
  }

  fun trimLocations() {
    val realm = getRealmInstance()

    realm.executeTransaction {
      realm.where<Location>()
          .lessThan(Location.KEY_TIME, getCutoffTimestamp(DAYS_TO_KEEP))
          .findAll()
          .deleteAllFromRealm()
    }

    realm.close()
  }

  fun getLocations(promise: Promise) {
    val realm = getRealmInstance()

    val deviceResults = realm.where<Location>()
        .greaterThanOrEqualTo(Location.KEY_TIME, getCutoffTimestamp(DAYS_TO_KEEP))
        .sort(Location.KEY_TIME, ASCENDING)
        .findAll()

    val writeableArray = WritableNativeArray()
    deviceResults.map {
      writeableArray.pushMap(it.toWritableMap())
    }

    promise.resolve(writeableArray)
    realm.close()
  }

  fun createAssumedLocations(previousLocation: Location?, newLocation: BackgroundLocation): List<Location> {
    val assumedLocationsToInsert = mutableListOf<Location>()
    previousLocation?.let { previous ->
          val isNearbyPrevious = areLocationsNearby(previous.latitude, previous.longitude, newLocation.latitude, newLocation.longitude)
          val isTimeWithinThreshold = newLocation.time - previous.time <= MAX_BACKFILL_TIME
          if (isNearbyPrevious && isTimeWithinThreshold) {
            val newTimestamp = newLocation.time
            val latestDesiredBackfill = newTimestamp - LOCATION_INTERVAL
            val earliestDesiredBackfill = Math.max(
                newLocation.time - MAX_BACKFILL_TIME, previous.time + LOCATION_INTERVAL
            )
            for (time in latestDesiredBackfill downTo earliestDesiredBackfill step LOCATION_INTERVAL) {
              assumedLocationsToInsert.add(createAssumedLocation(time, previous.latitude, previous.longitude))
            }
          }}
    return assumedLocationsToInsert
  }

  private fun getEncryptionKey(): ByteArray {
    val vault: SharedPreferenceVault =
      SharedPreferenceVaultFactory.getAppKeyedCompatAes256Vault(
          MainApplication.getContext(), MANUALLY_KEYED_PREF_FILE_NAME,
          MANUALLY_KEYED_KEY_FILE_NAME,
          MANUALLY_KEYED_KEY_ALIAS, MANUALLY_KEYED_KEY_INDEX,
          MANUALLY_KEYED_PRESHARED_SECRET
      )

    val existingKeyString = vault.getString(KEY_REALM_ENCRYPTION_KEY, null)

    return if (existingKeyString != null) {
      Base64.decode(existingKeyString, Base64.DEFAULT)
    } else {
      val newKey = ByteArray(64)
      SecureRandom().nextBytes(newKey)
      val newKeyString = Base64.encodeToString(newKey, Base64.DEFAULT)
      vault.edit().putString(KEY_REALM_ENCRYPTION_KEY, newKeyString).apply()
      newKey
    }
  }

  @VisibleForTesting
  fun getRealmInstance(): Realm {
    return Realm.getInstance(realmConfig)
  }
}
