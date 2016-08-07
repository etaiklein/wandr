import {Map} from 'immutable';
import {combineReducers} from 'redux-loop';
import {RESET_STATE} from '../modules/session/SessionState';

export default function createReducer() {
  const reducers = {
    // Authentication/login state
    auth: require('../modules/auth/AuthState').default,

    // Counter sample app state. This can be removed in a live application
    counter: require('../modules/counter/CounterState').default,

    navigationState: require('../modules/navigation/NavigationState').default,

    session: require('../modules/session/SessionState').default
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

  return function mainReducer(state, action) {
    if (action.type === RESET_STATE) {
      return namespacedReducer(action.payload, action);
    }

    return namespacedReducer(state || void 0, action);
  };
}
