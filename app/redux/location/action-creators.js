import {createAsyncFetch, createAsyncPost} from '../async/async-action';
import * as ActionTypes from './action-types';

export const updateCurrentLocation = (currentLocation) => {
  return {
    type: ActionTypes.UPDATE_CURRENT_LOCATION,
    currentLocation: currentLocation
  }
}

export const setGeocode = (geocode) => {
  return {
    type: ActionTypes.SET_GEOCODE,
    geocode: geocode,
    annotations: []
  }
}

export const fetchDistance = createAsyncPost({
  url: 'https://api.mapbox.com',
  path:  'distances/v1/mapbox/walking',
  action_types: [ActionTypes.FETCH_DISTANCE, ActionTypes.FETCH_DISTANCE_SUCCESS, ActionTypes.FETCH_DISTANCE_FAIL],
  mapResponse: (response) => response.durations[0][1],
  onError: (response) => response,
})

export const fetchGeocode = createAsyncFetch({
  url: 'https://api.mapbox.com',
  path:  'geocoding/v5/mapbox.places',
  action_types: [ActionTypes.FETCH_GEOCODE, ActionTypes.FETCH_GEOCODE_SUCCESS, ActionTypes.FETCH_GEOCODE_FAIL],
  mapResponse: (response) => response.features,
  onError: (response) => response,
})