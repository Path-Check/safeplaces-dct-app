package covidsafepaths.gps.bridge

import com.facebook.react.bridge.*
import covidsafepaths.gps.storage.Location.Companion.SOURCE_GOOGLE
import covidsafepaths.gps.storage.Location.Companion.SOURCE_MIGRATION
import covidsafepaths.gps.storage.SecureStorage
import org.pathcheck.covidsafepaths.BuildConfig;
import kotlin.Exception 


class Device(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "Device"
    }

    //exports a method getVersion to javascript
    @ReactMethod
    fun getVersion(cb:Callback) {
        try{
            return cb.invoke(null, BuildConfig.VERSION_NAME)
        } catch(e:Exception ){
            return cb.invoke(e,null)
        }
       
    }
    //exports a method getBuild to javascript
    @ReactMethod
    fun getBuildNumber(cb:Callback) {
        try{
            return cb.invoke(null, BuildConfig.VERSION_CODE)
        } catch(e:Exception ){
            return cb.invoke(e,null)
        }
       
    }
}