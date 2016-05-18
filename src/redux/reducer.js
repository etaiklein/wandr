import {Map} from 'immutable';
import {combineReducers} from 'redux-loop';
import NavigationStateReducer from '../modules/navigation/NavigationState';
import AuthStateReducer from '../modules/auth/AuthState';
import LocationStateReducer from '../modules/location/LocationState';
import SessionStateReducer, {RESET_STATE} from '../modules/session/SessionState';

const reducers = {
  // Authentication/login state
  auth: AuthStateReducer,

  // Location app state
  location: LocationStateReducer,

  // @NOTE: By convention, the navigation state must live in a subtree called
  //`navigationState`
  navigationState: NavigationStateReducer,

  session: SessionStateReducer

};

// initial state, accessor and mutator for supporting root-level
// immutable data with redux-loop reducer combinator
const immutableStateContainer = Map();
const getImmutable = (child, key) => child ? child.get(key) : void 0;
const setImmutable = (child, key, value) => child.set(key, value);

const namespacedReducer = combineReducers(
  reducers,
  immutableStateContainer,
  getImmutable,
  setImmutable
);

export default function mainReducer(state, action) {
  if (action.type === RESET_STATE) {
    return namespacedReducer(action.payload, action);
  }

  return namespacedReducer(state || void 0, action);
}
