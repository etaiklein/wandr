package com.wandr2;

import android.app.Application;
import android.util.Log;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.mapbox.reactnativemapboxgl.ReactNativeMapboxGLPackage; // <-- import
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;  // <--- Import Package
import com.marianhello.react.BackgroundGeolocationPackage;  // <--- Import Package

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    protected boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
          new ReactNativeMapboxGLPackage(),  // <-- Register package here
          new ReactNativePushNotificationPackage() // <---- Add the Package
          new BackgroundGeolocationPackage() // <---- Add the Package
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
      return mReactNativeHost;
  }
}
