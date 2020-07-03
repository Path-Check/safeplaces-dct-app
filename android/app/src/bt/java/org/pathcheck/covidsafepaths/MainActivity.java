package org.pathcheck.covidsafepaths;

import android.app.Activity;
import android.content.Intent;
import android.content.IntentSender;
import android.os.Bundle;
import android.util.Log;

import androidx.annotation.Nullable;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.nearby.exposurenotification.ExposureNotificationStatusCodes;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

import org.devio.rn.splashscreen.SplashScreen;

import covidsafepaths.bt.exposurenotifications.ExposureNotificationClientWrapper;
import covidsafepaths.bt.exposurenotifications.utils.CallbackMessages;
import covidsafepaths.bt.exposurenotifications.utils.RequestCodes;
import covidsafepaths.bt.exposurenotifications.utils.Util;

public class MainActivity extends ReactActivity {

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    SplashScreen.show(this, R.style.SplashTheme);
    super.onCreate(savedInstanceState);
    hitIt(5);

  }

  private void hitIt(int repeat) {
    if(repeat == 0) {
      return;
    }
    ExposureNotificationClientWrapper.get(this)
            .isEnabled().addOnSuccessListener(
            enabled -> {
              if(enabled) {
                Log.d("HELLO123", " MainActivity enabled");
                hitIt(repeat - 1);
                //callback.invoke(Util.toWritableArray(CallbackMessages.EN_AUTHORIZATION_AUTHORIZED, CallbackMessages.EN_ENABLEMENT_ENABLED));
              } else {
                Log.d("HELLO123", "MainActivity disabled");
                hitIt(repeat - 1);
                //callback.invoke(Util.toWritableArray(CallbackMessages.EN_AUTHORIZATION_UNAUTHORIZED, CallbackMessages.EN_ENABLEMENT_DISABLED));
              }
            })
            .addOnFailureListener(
                    exception -> {
                      Log.d("HELLO123", "failure");
                      if (!(exception instanceof ApiException)) {
                        //callback.invoke(CallbackMessages.ERROR_UNKNOWN);
                      } else {
                        ApiException apiException = (ApiException) exception;
                        //callback.invoke(apiException.getStatus().toString());
                      }
                    });
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

  public void showPermission(ApiException apiException) {
    try {
      apiException
              .getStatus()
              .startResolutionForResult(
                      this, RequestCodes.REQUEST_CODE_START_EXPOSURE_NOTIFICATION);
    }catch (IntentSender.SendIntentException e) {
      Log.d("MainActivity", "Error calling startResolutionForResult", apiException);
    }
  }

  // TODO Perhaps use React Native activity result listener flow to get result:
  // https://reactnative.dev/docs/native-modules-android#getting-activity-result-from-startactivityforresult
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
      Log.d("MainActivity", "RESULT_OK");
      sendEvent(true);
      final ReactContext reactContext = getReactNativeHost().getReactInstanceManager().getCurrentReactContext();
      ExposureNotificationClientWrapper.get(reactContext)
              .start()
              .addOnSuccessListener(
                      unused -> {
                        Log.d("HELLO123", "request success");
                      })
              .addOnFailureListener(
                      exception -> {
                        Log.d("HELLO123", "request failure");
                        if (!(exception instanceof ApiException)) {
                          Log.d("HELLO123", "error unkown");
                          return;
                        }
                        ApiException apiException = (ApiException) exception;
                        if (apiException.getStatusCode()
                                == ExposureNotificationStatusCodes.RESOLUTION_REQUIRED) {
                          Log.d("HELLO123", "res required");
                          MainActivity mainActivity = (MainActivity) reactContext.getCurrentActivity();
                          mainActivity.showPermission(apiException);

                        } else {
                        }
                      })
              .addOnCanceledListener(() -> {
                Log.d("HELLO123", "request cancelled");
                //callback.invoke(CallbackMessages.CANCELLED);
              });
    } else {
      Log.d("MainActivity", "NOT RESULT_OK");
      sendEvent(false);
    }
  }

  private void sendEvent(boolean enabled) {
    Log.d("HELLO123", "sendEvent");
    final ReactContext reactContext = getReactNativeHost().getReactInstanceManager().getCurrentReactContext();
    WritableArray params = null;

    if(enabled) {
      params = Util.toWritableArray(CallbackMessages.EN_AUTHORIZATION_AUTHORIZED, CallbackMessages.EN_ENABLEMENT_ENABLED);
    } else {
     params = Util.toWritableArray(CallbackMessages.EN_AUTHORIZATION_UNAUTHORIZED, CallbackMessages.EN_ENABLEMENT_DISABLED);
    }

    reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit("onEnabledStatusUpdated", params);
  }
}