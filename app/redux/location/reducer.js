import * as ActionTypes from './action-types'

const initialState = {
  distance_loaded: false,
  distance_loading: false,
  distance_error: "",
  distance: 0,
  geocode_loaded: false,
  geocode_loading: false,
  geocode_error: "",
  geocode: [],
  current_location: [],
  annotations: [],
}

export default form = (state = initialState, action) => {
  switch (action.type) {

    case ActionTypes.UPDATE_CURRENT_LOCATION: 
      return Object.assign({}, state, {
        ...state,
        current_location: action.current_location
      });

    case ActionTypes.FETCH_DISTANCE:
      return Object.assign({}, state, {
        ...state,
        distance_loaded: false,
        distance_loading: true,
      });

    case ActionTypes.FETCH_DISTANCE_SUCCESS:
      return Object.assign({}, state, {
        ...state,
        distance_loaded: true,
        distance_loading: false,
        distance_error: null,
        distance: action.data,
      });

    case ActionTypes.FETCH_DISTANCE_FAIL:
      return Object.assign({}, state, {
        ...state,
        distance_loading: false,
        distance_error: action.error,
      });

    case ActionTypes.FETCH_GEOCODE:
      return Object.assign({}, state, {
        ...state,
        geocode_loaded: false,
        geocode_loading: true,
      });

    case ActionTypes.FETCH_GEOCODE_SUCCESS:
      return Object.assign({}, state, {
        ...state,
        geocode_loaded: true,
        geocode_loading: false,
        geocode_error: null,
        geocode: action.data.reverse(), //(long, lat) to Standard Format (lat, long)
        annotations: [{
          coordinates: action.data, //(long, lat) to Standard Format (lat, long)
          type: 'point',
          id: "destination"
        }]
      });

    case ActionTypes.FETCH_GEOCODE_FAIL:
      return Object.assign({}, state, {
        ...state,
        geocode_loading: false,
        geocode_error: action.error,
      });

    default:
      return state
  }
}