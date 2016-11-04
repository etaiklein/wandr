import React, {Component} from 'react';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider, connect } from 'react-redux';
import thunk from 'redux-thunk';
import {Alert} from 'react-native';
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
    Alert.alert(
      notification.title, 
      notification.message,
      [
        {text: '🗺👀', onPress: () => console.log('TODO: open maps')},
        {text: '👌', onPress: () => console.log('OK Pressed')},
      ]);
  },
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