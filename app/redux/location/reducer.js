import * as ActionTypes from './action-types'

//TODO: use camelCase

const initialState = {
  distanceLoaded: false,
  distanceLoading: false,
  distanceError: "",
  distance: 0,
  queries: [],
  geocodeLoaded: false,
  geocodeLoading: false,
  geocodeError: "",
  geocode: {
    latitude: '',
    longitude: ''
  },
  currentLocation: {
    latitude: '',
    longitude: ''
  },
  annotations: [],
}

export default location = (state = initialState, action) => {
  switch (action.type) {

    case ActionTypes.UPDATE_CURRENT_LOCATION: 
      return {
        ...state,
        currentLocation: {
          latitude: action.currentLocation[1],
          longitude: action.currentLocation[0]
        }
      };

    case ActionTypes.FETCH_DISTANCE:
      return {
        ...state,
        distanceLoaded: false,
        distanceLoading: true,
      };

    case ActionTypes.FETCH_DISTANCE_SUCCESS:
      return {
        ...state,
        distanceLoaded: true,
        distanceLoading: false,
        distanceError: null,
        distance: action.data,
      };

    case ActionTypes.FETCH_DISTANCE_FAIL:
      return {
        ...state,
        distanceLoading: false,
        distanceError: action.error,
      };

    case ActionTypes.FETCH_GEOCODE:
      return {
        ...state,
        geocodeLoaded: false,
        geocodeLoading: true,
      };

    case ActionTypes.FETCH_GEOCODE_SUCCESS:
      return {
        ...state,
        geocodeLoaded: true,
        geocodeLoading: false,
        geocodeError: null,
        geocode: {
          latitude: action.data[0].geometry.coordinates[1],
          longitude: action.data[0].geometry.coordinates[0]
        },
        annotations: [{
          coordinates: action.data[0].geometry.coordinates.reverse(), //(long, lat) to Standard Format (lat, long)
          type: 'point',
          id: "destination"
        }],
        queries: action.data,
      };

    case ActionTypes.FETCH_GEOCODE_FAIL:
      return {
        ...state,
        geocodeLoading: false,
        geocodeError: action.error,
      };

    case ActionTypes.SET_GEOCODE:
      return {
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
      };

    default:
      return state
  }
}