// reducers/index.js

import { combineReducers } from 'redux';
import routes from './routes';
import form from './form/reducer';
// ... other reducers

export default combineReducers({
  routes,
  form,
  // ... other reducers
});