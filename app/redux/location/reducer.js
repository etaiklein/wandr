import * as ActionTypes from './action-types'

const initialState = {
  distance_loaded: false,
  distance_loading: false,
  distance_error: "",
  distance: 0,
  geocode_loaded: false,
  geocode_loading: false,
  geocode_error: "",
  geocode: {
    latitude: '',
    longitude: ''
  },
  current_location: {
    latitude: '',
    longitude: ''
  },
  annotations: [],
}

export default location = (state = initialState, action) => {
  switch (action.type) {

    case ActionTypes.UPDATE_CURRENT_LOCATION: 
      return Object.assign({}, state, {
        ...state,
        current_location: {
          latitude: action.current_location[1],
          longitude: action.current_location[0]
        }
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
        geocode: {
          latitude: action.data[1],
          longitude: action.data[0]
        },
        annotations: [{
          coordinates: action.data.reverse(), //(long, lat) to Standard Format (lat, long)
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

    case ActionTypes.SET_GEOCODE:
      return Object.assign({}, state, {
        ...state,
        geocode: {
          latitude: action.geocode[1],
          longitude: action.geocode[0]
        },
        annotations: [{
          coordinates: action.geocode.reverse(),
          type: 'point',
          id: "destination"
        }]
      });

    default:
      return state
  }
}