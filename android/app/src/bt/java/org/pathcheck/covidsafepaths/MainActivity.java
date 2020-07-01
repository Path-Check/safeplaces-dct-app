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
import com.google.android.gms.common.api.ApiException;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

import org.devio.rn.splashscreen.SplashScreen;

import covidsafepaths.bt.exposurenotifications.utils.RequestCodes;

public class MainActivity extends ReactActivity {

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    SplashScreen.show(this, R.style.SplashTheme);
    super.onCreate(savedInstanceState);
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
    } else {
      Log.d("MainActivity", "NOT RESULT_OK");
    }
  }
}