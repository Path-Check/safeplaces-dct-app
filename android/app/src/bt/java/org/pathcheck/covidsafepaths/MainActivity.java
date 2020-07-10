package org.pathcheck.covidsafepaths;

import android.app.Activity;
import android.content.Intent;
import android.content.IntentSender;
import android.os.Bundle;

import androidx.annotation.Nullable;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.android.gms.common.api.ApiException;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

import org.devio.rn.splashscreen.SplashScreen;

import covidsafepaths.bt.exposurenotifications.ExposureNotificationClientWrapper;
import covidsafepaths.bt.exposurenotifications.nearby.ProvideDiagnosisKeysWorker;
import covidsafepaths.bt.exposurenotifications.utils.CallbackMessages;
import covidsafepaths.bt.exposurenotifications.utils.RequestCodes;
import covidsafepaths.bt.exposurenotifications.utils.Util;

import static covidsafepaths.bt.exposurenotifications.utils.CallbackMessages.EN_STATUS_EVENT;

public class MainActivity extends ReactActivity {

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    SplashScreen.show(this, R.style.SplashTheme);
    super.onCreate(savedInstanceState);
  }

  @Override
  protected void onResume() {
    super.onResume();
    checkIfExposureNotificationsEnabled();
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "COVIDSafePaths";
  }

  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new ReactActivityDelegate(this, getMainComponentName()) {
      @Override
      protected ReactRootView createRootView() {
       return new RNGestureHandlerEnabledRootView(MainActivity.this);
      }
    };
  }

  /**
   * Must check every time the app resumes to handle the case when a different app on the device
   * requests Exposure Notifications. If that happens, our app loses access to Exposure Notifications.
   * Checking on resume will ensure the user is shown that Exposure Notifications are disabled in
   * this app.
   */
  private void checkIfExposureNotificationsEnabled() {
    ExposureNotificationClientWrapper.get(this)
            .isEnabled().addOnSuccessListener(
            enabled -> {
              handleExposureStateChanged(enabled);
            });

  }

  public void showPermission(ApiException apiException) {
    try {
      apiException
              .getStatus()
              .startResolutionForResult(
                      this, RequestCodes.REQUEST_CODE_START_EXPOSURE_NOTIFICATION);
    }catch (IntentSender.SendIntentException e) {

    }
  }

  @Override
  public void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
    super.onActivityResult(requestCode, resultCode, data);
    onResolutionComplete(requestCode, resultCode);
  }

  /**
   * Called when opt-in resolution is completed by user.
   *
   * <p>Modeled after {@code Activity#onActivityResult} as that's how the API sends callback to
   * apps.
   */
  public void onResolutionComplete(int requestCode, int resultCode) {
    if (requestCode != RequestCodes.REQUEST_CODE_START_EXPOSURE_NOTIFICATION) {
      return;
    }
    if (resultCode == Activity.RESULT_OK) {
      final ReactContext reactContext = getReactNativeHost().getReactInstanceManager().getCurrentReactContext();
      ExposureNotificationClientWrapper.get(reactContext)
              .start()
              .addOnSuccessListener(
                      unused -> {
                        handleExposureStateChanged(true);
                      })
              .addOnFailureListener(
                      exception -> {
                        handleExposureStateChanged(false);
                      })
              .addOnCanceledListener(() -> {
                handleExposureStateChanged(false);
              });
    } else {
      handleExposureStateChanged(false);
    }
  }


  private void handleExposureStateChanged(boolean enabled) {
    final ReactContext reactContext = getReactNativeHost().getReactInstanceManager().getCurrentReactContext();
    WritableArray params = null;

    if(enabled) {
      params = Util.toWritableArray(CallbackMessages.EN_AUTHORIZATION_AUTHORIZED, CallbackMessages.EN_ENABLEMENT_ENABLED);
      ProvideDiagnosisKeysWorker.scheduleDailyProvideDiagnosisKeys(this);
    } else {
     params = Util.toWritableArray(CallbackMessages.EN_AUTHORIZATION_UNAUTHORIZED, CallbackMessages.EN_ENABLEMENT_DISABLED);
      ProvideDiagnosisKeysWorker.cancelDailyProvideDiagnosisKeys(this);
    }

    if(reactContext != null) {
      reactContext
              .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
              .emit(EN_STATUS_EVENT, params);

    }
  }
}