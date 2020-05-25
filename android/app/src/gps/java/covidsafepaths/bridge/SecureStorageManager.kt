package covidsafepaths.bridge

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray
import covidsafepaths.storage.Location.Companion.SOURCE_GOOGLE
import covidsafepaths.storage.Location.Companion.SOURCE_MIGRATION
import covidsafepaths.storage.SecureStorage

class SecureStorageManager(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String {
    return "SecureStorageManager"
  }

  @ReactMethod
  fun getLocations(promise: Promise) {
    SecureStorage.getLocations(promise)
  }

  @ReactMethod
  fun importGoogleLocations(locations: ReadableArray, promise: Promise) {
    SecureStorage.importLocations(locations, SOURCE_GOOGLE, promise)
  }

  @ReactMethod
  fun migrateExistingLocations(locations: ReadableArray, promise: Promise) {
    SecureStorage.importLocations(locations, SOURCE_MIGRATION, promise)
  }
}