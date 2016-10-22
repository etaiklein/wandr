// reducers/index.js

import { combineReducers } from 'redux';
import routes from './routes';
import form from './form/reducer';
import createAsyncReducer from './async/async-reducer';

// ... other reducers

const distance = createAsyncReducer('distance');
const coordinates = createAsyncReducer('geocode');

export default combineReducers({
  routes,
  form,
  distance,
  coordinates,
  // ... other reducers
});