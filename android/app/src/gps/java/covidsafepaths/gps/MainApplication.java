package covidsafepaths.gps;

import android.app.Application;
import android.content.Context;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.marianhello.bgloc.BackgroundGeolocationFacade;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import org.pathcheck.covidsafepaths.BuildConfig;
import io.realm.Realm;
import java.lang.reflect.InvocationTargetException;
import java.util.List;
import covidsafepaths.gps.bridge.RealmPackage;
import covidsafepaths.gps.storage.SecureStorage;

public class MainApplication extends Application implements ReactApplication {

  private static Context context;

  private final ReactNativeHost mReactNativeHost =
          new ReactNativeHost(this) {
            @Override
            public boolean getUseDeveloperSupport() {
              return BuildConfig.DEBUG;
            }

            @Override
            protected List<ReactPackage> getPackages() {
              @SuppressWarnings("UnnecessaryLocalVariable")
              List<ReactPackage> packages = new PackageList(this).getPackages();
              // Packages that cannot be autolinked yet can be added manually here, for example:
              // packages.add(new MyReactNativePackage());
              packages.add(new RealmPackage());

              return packages;
            }

            @Override
            protected String getJSMainModuleName() {
              return "index";
            }
          };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    MainApplication.context = getApplicationContext();
    SoLoader.init(this, /* native exopackage */ false);
    initializeFlipper(this); // Remove this line if you don't want Flipper enabled
    Realm.init(this);
    initializeGeolocationTransformer();
    // Ignore assignment. Creating to begin heavy encryption work
    SecureStorage wrapper = SecureStorage.INSTANCE;
  }

  /**
   * Loads Flipper in React Native templates.
   *
   * @param context
   */
  private static void initializeFlipper(Context context) {
    if (BuildConfig.DEBUG) {
      try {
        /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
        Class<?> aClass = Class.forName("com.facebook.flipper.ReactNativeFlipper");
        aClass.getMethod("initializeFlipper", Context.class).invoke(null, context);
      } catch (ClassNotFoundException e) {
        e.printStackTrace();
      } catch (NoSuchMethodException e) {
        e.printStackTrace();
      } catch (IllegalAccessException e) {
        e.printStackTrace();
      } catch (InvocationTargetException e) {
        e.printStackTrace();
      }
    }
  }

  private void initializeGeolocationTransformer() {
    BackgroundGeolocationFacade.setLocationTransform((context, location) -> {

      // Save Location in encrypted realm db
      SecureStorage.INSTANCE.saveDeviceLocation(location);

      // Always return null. We never want to store data in the libraries SQLite DB
      return null;
    });
  }

  public static Context getContext() {
    return MainApplication.context;
  }
}
