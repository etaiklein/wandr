// reducers/index.js

import { combineReducers } from 'redux';
import routes from './routes';
import form from './form/reducer';
import location from './location/reducer';

export default combineReducers({
  routes,
  form,
  location,
  // ... other reducers
});