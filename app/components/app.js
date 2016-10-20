import React, {Component} from 'react';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider, connect } from 'react-redux';
import thunk from 'redux-thunk';
import { Router, Scene } from 'react-native-router-flux';
import configureStore from '../redux/configure-store';

const store = configureStore();
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