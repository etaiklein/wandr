package com.kindling;

import android.os.Bundle;
import android.util.Log;

import com.facebook.react.ReactActivity;
import com.auth0.lock.react.LockReactPackage;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.google.android.gms.common.api.PendingResult;
import com.google.android.gms.common.api.ResultCallback;
import com.google.android.gms.tagmanager.Container;
import com.google.android.gms.tagmanager.ContainerHolder;
import com.google.android.gms.tagmanager.TagManager;

import java.util.Arrays;
import java.util.List;
import java.util.concurrent.TimeUnit;

public class MainActivity extends ReactActivity {
    private static String TAG = MainActivity.class.getSimpleName();

    protected String getMainComponentName() {
        return "Kindling";
    }

    /**
     * Returns whether dev mode should be enabled.
     * This enables e.g. the dev menu.
     */
    @Override
    protected boolean getUseDeveloperSupport() {
        return BuildConfig.DEBUG;
    }

    /**
     * A list of packages used by the app. If the app uses additional views
     * or modules besides the default ones, add more packages here.
     */
    @Override
    protected List<ReactPackage> getPackages() {
        return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            new LockReactPackage()
        );
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Log.d(TAG, "Initialising TagManager");
        TagManager tagManager = TagManager.getInstance(this);
        PendingResult<ContainerHolder> pending =
                tagManager.loadContainerPreferNonDefault("GTM-MKJZGQ",
                        R.raw.gtm_mkjzgq);


        pending.setResultCallback(new ResultCallback<ContainerHolder>() {
            @Override
            public void onResult(ContainerHolder containerHolder) {
                Analytics.initialize(MainActivity.this, containerHolder);
                Container container = containerHolder.getContainer();
                if (!containerHolder.getStatus().isSuccess()) {
                    Log.e(TAG, "failure loading container");
                    return;
                }

                Log.e(TAG, "Sending sample screen view");

                Analytics.sendScreenView("Test screen #1");
            }
        }, 10000, TimeUnit.MILLISECONDS);

    }
}
