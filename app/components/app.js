import React, {Component} from 'react';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider, connect } from 'react-redux';
import thunk from 'redux-thunk';
import { Router, Scene } from 'react-native-router-flux';
import configureStore from '../redux/configure-store';
import {fetchDistance, fetchGeocode} from '../redux/location/action-creators';

const store = configureStore();
// store.dispatch(fetchGeocode('1600+Pennsylvania+Ave+nw'));
// store.dispatch(fetchDistance([[-77.083056,38.908611],[-76.997778,38.959167]]));
var PushNotification = require('react-native-push-notification');

PushNotification.configure({
  // (required) Called when a remote or local notification is opened or received
  onNotification: function(notification) {
    console.log( 'NOTIFICATION:', notification );
  },
});

PushNotification.localNotification({
    /* iOS and Android properties */
    title: "My Notification Title", // (optional, for iOS this is only used in apple watch, the title will be the app name on other iOS devices)
    message: "My Notification Message", // (required)
    playSound: false, // (optional) default: true
    soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
});

const RouterWithRedux = connect()(Router);

import Welcome from './welcome';
import Journey from './journey';

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <RouterWithRedux>
          <Scene key="root">
            <Scene key="welcome" component={Welcome} title="Welcome" initial={true} />
            <Scene key="journey" component={Journey} title="Journey" />
          </Scene>
        </RouterWithRedux>
      </Provider>
    );
  }
}