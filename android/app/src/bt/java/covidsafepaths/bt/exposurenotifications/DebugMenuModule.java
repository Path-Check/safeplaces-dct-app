package covidsafepaths.bt.exposurenotifications;

import android.util.Log;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;
import com.google.android.gms.nearby.exposurenotification.TemporaryExposureKey;
import com.google.common.util.concurrent.FutureCallback;
import com.google.common.util.concurrent.Futures;
import com.google.common.util.concurrent.ListenableFuture;

import java.util.List;

import javax.annotation.Nonnull;

import covidsafepaths.bt.exposurenotifications.common.AppExecutors;
import covidsafepaths.bt.exposurenotifications.debug.DebugExposureNotificationUtils;
import covidsafepaths.bt.exposurenotifications.notify.ShareDiagnosisManager;

@ReactModule(name = DebugMenuModule.MODULE_NAME)
public class DebugMenuModule extends ReactContextBaseJavaModule {
    private static ReactApplicationContext reactContext;

    static final String MODULE_NAME = "DebugMenuModule";

    private final ShareDiagnosisManager shareDiagnosisManager;

    public DebugMenuModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
        shareDiagnosisManager = new ShareDiagnosisManager(context);
    }

    @Override
    public @Nonnull
    String getName() {
        return MODULE_NAME;
    }

    /**
     * Debug method to get a fake set of diagnosis keys and post them to the server.
     * Does NOT currently interact with GAEN API
     * TODO - JS is always interpreting callback as error because js layer is expecting an array.
     * // TODO Dive into this after enable EN
     * Second value is success message, first value is error message
     */
    @ReactMethod
    public void getAndPostDiagnosisKeys(Callback callback) {
        List<TemporaryExposureKey> debugTEKS = DebugExposureNotificationUtils.INSTANCE.getFakeRecentKeys();
        ListenableFuture<Boolean> shareKeysFuture = shareDiagnosisManager.submitKeysToService(debugTEKS);
        FutureCallback<Boolean> shareKeysCallback = new FutureCallback<Boolean>() {
            @Override
            public void onSuccess(Boolean result) {
                if (result) {
                    String successMessage = "Shared debug keys with server";
                    // TODO make this an array
                    callback.invoke(null, successMessage);
                    Log.d(MODULE_NAME, successMessage);
                } else {
                    this.onFailure(new Throwable("Error sharing debug keys with server"));
                }
            }

            @Override
            public void onFailure(Throwable t) {
                callback.invoke(t.getMessage());
                Log.e(MODULE_NAME, "Error sharing debug keys with server", t);
            }
        };
        Futures.addCallback(shareKeysFuture, shareKeysCallback, AppExecutors.getLightweightExecutor());
    }

    /**
     * For now, tie this to saving a positive diagnosis to the local db for testing
     */
    @ReactMethod
    public void simulatePositiveDiagnosis(Callback callback) {
        // TODO get callback to share with JS layer
        shareDiagnosisManager.saveNewDiagnosis(true);
    }
}
