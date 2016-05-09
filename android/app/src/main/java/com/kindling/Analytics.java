package com.kindling;

import android.content.Context;

import com.google.android.gms.tagmanager.ContainerHolder;
import com.google.android.gms.tagmanager.DataLayer;
import com.google.android.gms.tagmanager.TagManager;

/**
 * Singleton to hold the GTM Container (since it should be only created once
 * per run of the app).
 */
public class Analytics {

    private static ContainerHolder containerHolder;
    private static Context context;

    /**
     * Utility class; don't instantiate.
     */
    private Analytics() {
    }

    public static void sendScreenView(String screenName) {
        DataLayer dataLayer = TagManager.getInstance(context).getDataLayer();
        dataLayer.pushEvent("openScreen", DataLayer.mapOf(
                "screenView", screenName
        ));
    }

    public static ContainerHolder getContainerHolder() {
        return containerHolder;
    }

    public static void initialize(Context _context, ContainerHolder _containerHolder) {
        containerHolder = _containerHolder;
        context = _context;
    }
}