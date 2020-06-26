package covidsafepaths.bt;

import android.app.Application;
import android.content.Context;
import android.util.Log;

import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import com.facebook.stetho.Stetho;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.nearby.Nearby;
import com.google.android.gms.nearby.exposurenotification.ExposureNotificationClient;
import com.google.android.gms.nearby.exposurenotification.ExposureNotificationStatusCodes;
import com.uphyca.stetho_realm.RealmInspectorModulesProvider;

import java.lang.reflect.InvocationTargetException;
import java.util.List;
import java.util.regex.Pattern;

import org.pathcheck.covidsafepaths.BuildConfig;

import covidsafepaths.bt.bridge.ExposureNotificationsPackage;
import covidsafepaths.bt.exposurenotifications.ExposureNotificationClientWrapper;
import covidsafepaths.bt.exposurenotifications.storage.RealmSecureStorageBte;
import io.realm.Realm;

public class MainApplication extends Application implements ReactApplication {

    private static Context context;
    private ExposureNotificationClient exposureNotificationClient;

    private final ReactNativeHost mReactNativeHost =
            new ReactNativeHost(this) {
                @Override
                public boolean getUseDeveloperSupport() {
                    return BuildConfig.DEBUG;
                }

                @Override
                protected List<ReactPackage> getPackages() {
                    List<ReactPackage> packages = new PackageList(this).getPackages();
                    packages.add(new ExposureNotificationsPackage());


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
        Realm.init(this);
        initializeStetho(this);
        initializeFlipper(this); // Remove this line if you don't want Flipper enabled
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

    private void initializeStetho(Context context) {
        if (BuildConfig.DEBUG) {
            RealmInspectorModulesProvider modulesProvider = RealmInspectorModulesProvider.builder(context)
                    .withEncryptionKey("safepathsbte.realm", RealmSecureStorageBte.INSTANCE.getEncryptionKey())
                    .databaseNamePattern(Pattern.compile(".+\\.realm"))
                    .build();
            Stetho.initialize(
                    Stetho.newInitializerBuilder(this)
                            .enableDumpapp(Stetho.defaultDumperPluginsProvider(context))
                            .enableWebKitInspector(modulesProvider)
                            .build());
        }
    }

    public static Context getContext() {
        return MainApplication.context;
    }
}
