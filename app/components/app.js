import React, {Component} from 'react';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider, connect } from 'react-redux';
import thunk from 'redux-thunk';
import {Alert } from 'react-native';
import { Router, Scene } from 'react-native-router-flux';
import configureStore from '../redux/configure-store';
import {notificationSent, notificationReceived} from '../redux/notification/action-creators'


const store = configureStore();
var PushNotification = require('react-native-push-notification');

PushNotification.configure({
  // (required) Called when a remote or local notification is opened or received
  onNotification: function(notification) {
    if (!store.getState().notification.notify) {return} //singleton notification
    Alert.alert(
      notification.title, 
      notification.message,
      [
        {text: '🗺👀', onPress: () => store.dispatch(notificationReceived())},
        {text: '👌', onPress: () => store.dispatch(notificationReceived())},
      ]
    );
    store.dispatch(notificationSent());
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