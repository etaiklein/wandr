import {createAsyncFetch, createAsyncPost} from '../async/async-action';

export const fetchDistance = createAsyncPost({
    //TODO: use env variable for base url
    url: 'https://api.mapbox.com',
    path:  'distances/v1/mapbox/walking',
    label:  'distance',
    mapResponse: (response) => response.durations[0][1],
    onError: (response) => response,
})

export const fetchGeocode = createAsyncFetch({
  //TODO: use env variable for base url
  url: 'https://api.mapbox.com',
  path:  'geocoding/v5/mapbox.places',
  label:  'geocode',
  mapResponse: (response) => response.features[0].geometry.coordinates,
  onError: (response) => response,
})