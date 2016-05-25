package com.kindling.analytics;

import android.content.Context;
import android.util.Log;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableNativeMap;
import com.google.android.gms.common.api.PendingResult;
import com.google.android.gms.common.api.ResultCallback;
import com.google.android.gms.tagmanager.ContainerHolder;
import com.google.android.gms.tagmanager.DataLayer;
import com.google.android.gms.tagmanager.TagManager;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.kindling.R;

import java.util.concurrent.TimeUnit;


public class AnalyticsModule extends ReactContextBaseJavaModule {


    private static String TAG = AnalyticsModule.class.getSimpleName();

    // static initialization code
    private static ContainerHolder tagManagerContainerHolder;
    private static Context androidContext;
    public static void initialize(Context context) {

        Log.d(TAG, "Initialising TagManager");

        androidContext = context;

        TagManager tagManager = TagManager.getInstance(context);
        PendingResult<ContainerHolder> pending =
                tagManager.loadContainerPreferNonDefault("GTM-T6GG6H", R.raw.gtm_t6gg6h);

        pending.setResultCallback(new ResultCallback<ContainerHolder>() {
            @Override
            public void onResult(ContainerHolder containerHolder) {
                if (!containerHolder.getStatus().isSuccess()) {
                    Log.e(TAG, "Failure loading TagManager container");
                } else {
                    Log.d(TAG, "Successfully initialized TagManager container");
                    tagManagerContainerHolder = containerHolder;
                }
            }
        }, 10000, TimeUnit.MILLISECONDS);
    }

    // module constructor
    public AnalyticsModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @ReactMethod
    public static void sendScreenView(String screenName) {
        if(tagManagerContainerHolder == null || !tagManagerContainerHolder.getStatus().isSuccess()) {
            Log.w(TAG, "Ignoring Analytics screenView, TagManager container not initialized");
            return;
        }

        DataLayer dataLayer = TagManager.getInstance(androidContext).getDataLayer();
        dataLayer.pushEvent("screenView", DataLayer.mapOf("screenName", screenName));
    }

    @ReactMethod
    public static void sendEvent(String eventName, ReadableMap fields) {

        Log.d(TAG, "Sending event " + eventName);
        if(tagManagerContainerHolder == null || !tagManagerContainerHolder.getStatus().isSuccess()) {
            Log.w(TAG, "Ignoring Analytics event, TagManager container not initialized");
            return;
        }

        // cast to concrete class to access .toHashMap method
        ReadableNativeMap fieldMap = (ReadableNativeMap)fields;

        DataLayer dataLayer = TagManager.getInstance(androidContext).getDataLayer();
        dataLayer.pushEvent(eventName, fieldMap.toHashMap());
    }

    @Override
    public String getName() {
        return "Analytics";
    }
}