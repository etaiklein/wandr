import {applyMiddleware, createStore, compose} from 'redux';
import * as reduxLoop from 'redux-loop';
import middleware from './middleware';
import createReducer from './reducer';

const enhancer = compose(
  applyMiddleware(...middleware),
  reduxLoop.install()
);

// create the store
const store = createStore(
  createReducer(),
  null,
  enhancer
);

if (__DEV__ && module.hot) {
  module.hot.accept(() => {
    const newReducer = require('./reducer').default();
    store.replaceReducer(newReducer);
  });
}

export default store;
