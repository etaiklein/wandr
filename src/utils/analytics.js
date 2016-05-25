import {NativeModules} from 'react-native';

/**
 * Sends an object to the analytics bridge
 */
export function sendEvent(eventName, fields) {
  try {
    if (__DEV__) {
      console.info('[Analytics]', eventName, fields);
    }
    NativeModules.Analytics.sendEvent(eventName, fields);
  } catch (e) {
    console.error('Failed to send analytics event ' + eventName, e);
  }
}

/**
 * Sugar for sending screenview events to analytics
 */
export function sendScreenView(screenName) {
  try {
    if (__DEV__) {
      console.info('[Analytics] Screen View', screenName);
    }
    NativeModules.Analytics.sendScreenView(screenName);
  } catch (e) {
    console.error('Failed to send analytics screenView', screenName, e);
  }
}
