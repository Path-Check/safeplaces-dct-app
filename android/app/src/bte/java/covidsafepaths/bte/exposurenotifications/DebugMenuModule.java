package covidsafepaths.bte.exposurenotifications;

import android.util.Log;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.google.android.gms.nearby.exposurenotification.TemporaryExposureKey;
import com.google.common.util.concurrent.FutureCallback;
import com.google.common.util.concurrent.Futures;
import com.google.common.util.concurrent.ListenableFuture;

import org.checkerframework.checker.nullness.compatqual.NullableDecl;

import java.util.List;

import javax.annotation.Nonnull;

import covidsafepaths.bte.exposurenotifications.common.AppExecutors;
import covidsafepaths.bte.exposurenotifications.debug.DebugExposureNotificationUtils;
import covidsafepaths.bte.exposurenotifications.notify.ShareDiagnosisManager;

public class DebugMenuModule extends ReactContextBaseJavaModule {
    private static ReactApplicationContext reactContext;

    private static final String MODULE_NAME = "EN Debug";

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

    @ReactMethod
    public void getAndPostDiagnosisKeys(Promise promise) {
        List<TemporaryExposureKey> debugTEKS = DebugExposureNotificationUtils.INSTANCE.getFakeRecentKeys();
        ListenableFuture<Boolean> shareKeysFuture = shareDiagnosisManager.submitKeysToService(debugTEKS);
        FutureCallback<Boolean> shareKeysCallback = new FutureCallback<Boolean>() {
            @Override
            public void onSuccess(@NullableDecl Boolean result) {
                // TODO
                Log.d(MODULE_NAME, "Shared debug keys with server");
            }

            @Override
            public void onFailure(Throwable t) {
                // TODO
                Log.e(MODULE_NAME, "Error sharing debug keys with server", t);
            }
        };
        Futures.addCallback(shareKeysFuture, shareKeysCallback, AppExecutors.getLightweightExecutor());
    }
}
