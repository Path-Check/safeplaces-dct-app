package covidsafepaths.bt.exposurenotifications.utils;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableNativeArray;

public class Util {
    /**
     * Create an array in React Native friendly format. Helpful when sending an array in a {@link Callback}.
     * @param args The values that make up the array.
     * @return React Native friendly array format.
     */
    public static WritableArray toWritableArray(String... args) {
        WritableArray array = new WritableNativeArray();
        for (String str:
             args) {
            array.pushString(str);
        }

        return array;
    }
}