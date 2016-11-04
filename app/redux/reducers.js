// reducers/index.js

import { combineReducers } from 'redux';
import routes from './routes';
import form from './form/reducer';
import location from './location/reducer';
import notification from './notification/reducer';

export default combineReducers({
  routes,
  form,
  location,
  notification
  // ... other reducers
});