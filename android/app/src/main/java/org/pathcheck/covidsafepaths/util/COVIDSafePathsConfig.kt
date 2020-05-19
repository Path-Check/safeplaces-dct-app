package org.pathcheck.covidsafepaths.util
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import org.pathcheck.covidsafepaths.BuildConfig

class COVIDSafePathsConfig(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "COVIDSafePathsConfig"
    }

    @ReactMethod
    fun getTracingStrategy(): String {
        if (BuildConfig.APPLICATION_ID == "org.pathcheck.covidsafepaths") {
            return "gps"
        } else {
            return "bte"
        }
    }

}

