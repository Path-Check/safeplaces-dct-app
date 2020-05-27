package covidsafepaths.gps.storage

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableArray
import com.marianhello.bgloc.data.BackgroundLocation
import java.util.concurrent.CountDownLatch
import java.util.concurrent.TimeUnit.SECONDS

object SecureStorage {
  private lateinit var secureStorage: RealmSecureStorage
  private var readyCountdown = CountDownLatch(1)

  init {
    Thread(Runnable {
      secureStorage = RealmSecureStorage()
      secureStorage.trimLocations()
      readyCountdown.countDown()
    }).start()
  }

  fun saveDeviceLocation(backgroundLocation: BackgroundLocation) {
    Thread(Runnable {
      val ready = readyCountdown.await(10, SECONDS)
      if (ready) {
        secureStorage.saveDeviceLocation(backgroundLocation)
      }
    }).start()
  }

  fun importLocations(locations: ReadableArray, source: Int, promise: Promise) {
    Thread(Runnable {
      val ready = readyCountdown.await(10, SECONDS)
      if (!ready) {
        promise.reject(java.lang.Exception("Failed to get Realm instance with encryption"))
        return@Runnable
      }
      secureStorage.importLocations(locations, source, promise)
    }).start()
  }

  fun getLocations(promise: Promise) {
    Thread(Runnable {
      val ready = readyCountdown.await(10, SECONDS)
      if (!ready) {
        promise.reject(java.lang.Exception("Failed to get Realm instance with encryption"))
        return@Runnable
      }

      secureStorage.getLocations(promise)
    }).start()
  }
}