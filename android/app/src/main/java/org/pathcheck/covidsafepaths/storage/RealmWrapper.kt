package org.pathcheck.covidsafepaths.storage

import android.util.Base64
import android.util.Log
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
import org.pathcheck.covidsafepaths.MainApplication
import org.pathcheck.covidsafepaths.storage.Location.Companion.KEY_SOURCE
import org.pathcheck.covidsafepaths.storage.Location.Companion.SOURCE_DEVICE
import org.pathcheck.covidsafepaths.util.getCutoffTimestamp
import java.security.SecureRandom
import java.util.concurrent.CountDownLatch
import java.util.concurrent.TimeUnit.SECONDS

object RealmWrapper {
  private const val TAG = "RealmWrapper"
  private const val MINIMUM_TIME_INTERVAL = 60000 * 4
  private const val DAYS_TO_KEEP = 14

  private const val MANUALLY_KEYED_PREF_FILE_NAME = "safepaths_enc_prefs"
  private const val MANUALLY_KEYED_KEY_FILE_NAME = "safepaths_enc_key"
  private const val MANUALLY_KEYED_KEY_ALIAS = "safepaths"
  private const val MANUALLY_KEYED_KEY_INDEX = 2
  private const val MANUALLY_KEYED_PRESHARED_SECRET = "" // This will not be used as we do not support < 18
  private const val KEY_REALM_ENCRYPTION_KEY = "KEY_REALM_ENCRYPTION_KEY"

  private var readyCountdown = CountDownLatch(1)

  init {
    Thread(Runnable {
      val encryptionKey = getEncryptionKey()

      val realmConfig = RealmConfiguration.Builder()
          .name("safepaths.realm")
          .encryptionKey(encryptionKey)
          .addModule(SafePathsRealmModule())
          .build()

      Realm.setDefaultConfiguration(realmConfig)
      readyCountdown.countDown()

      // With each new app init, trim locations to DAYS_TO_KEEP
      trimLocations()

    }).start()
  }

  fun saveDeviceLocation(backgroundLocation: BackgroundLocation) {
    Thread(Runnable {
      val ready = readyCountdown.await(10, SECONDS)
      if (!ready) return@Runnable

      val realm = Realm.getDefaultInstance()

      realm.executeTransaction {
        val realmResult = it.where<Location>()
            .equalTo(KEY_SOURCE, SOURCE_DEVICE)
            .sort(Location.KEY_TIME, DESCENDING)
            .limit(1)
            .findAll()

        val previousTime = realmResult.getOrNull(0)?.time ?: 0
        if (backgroundLocation.time - previousTime > MINIMUM_TIME_INTERVAL) {
          Log.d(TAG, "Inserting New Location")
          it.insert(Location.fromBackgroundLocation(backgroundLocation))
        } else {
          Log.d(TAG, "Ignoring save. Minimum time threshold not exceeded")
        }
      }

      realm.close()
    }).start()
  }

  fun importLocations(locations: ReadableArray, source: Int, promise: Promise) {
    Thread(Runnable {
      val ready = readyCountdown.await(10, SECONDS)
      if (!ready) {
        promise.reject(java.lang.Exception("Failed to get Realm instance with encryption"))
        return@Runnable
      }

      val realm = Realm.getDefaultInstance()

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
    }).start()
  }

  private fun trimLocations() {
    Thread(Runnable {
      val ready = readyCountdown.await(10, SECONDS)
      if (!ready) return@Runnable

      val realm = Realm.getDefaultInstance()

      realm.where<Location>()
          .lessThan(Location.KEY_TIME, getCutoffTimestamp(DAYS_TO_KEEP))
          .findAll()
          .deleteAllFromRealm()

      realm.close()
    }).start()
  }

  fun getLocations(promise: Promise) {
    Thread(Runnable {
      val ready = readyCountdown.await(10, SECONDS)
      if (!ready) {
        promise.reject(java.lang.Exception("Failed to get Realm instance with encryption"))
        return@Runnable
      }

      val realm = Realm.getDefaultInstance()

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
    }).start()
  }

  private fun getEncryptionKey(): ByteArray {
    val vault: SharedPreferenceVault =
      SharedPreferenceVaultFactory.getAppKeyedCompatAes256Vault(
          MainApplication.getContext(), MANUALLY_KEYED_PREF_FILE_NAME, MANUALLY_KEYED_KEY_FILE_NAME,
          MANUALLY_KEYED_KEY_ALIAS, MANUALLY_KEYED_KEY_INDEX, MANUALLY_KEYED_PRESHARED_SECRET
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
}