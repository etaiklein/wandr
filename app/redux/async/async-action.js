export const createAsyncFetch = function(options) {
  const {
    url,
    path,
    label,
    mapResponse,
    onError,
  } = options;

  const queryString = require('query-string');

  // Types
  //

  const FETCH = `${label}/FETCH`;
  const FETCH_SUCCESS = `${label}/FETCH_SUCCESS`;
  const FETCH_FAIL = `${label}/FETCH_FAIL`;

  // Actions
  // TODO: create more actions as necessary

  const fetcher = function(params = {}) {
    return (dispatch) => {
      dispatch({
        type: FETCH,
        params
      });

      //TODO:
      let auth = 'access_token=pk.eyJ1IjoiaXRzZXRhaSIsImEiOiJjaXNneGxxNHQwMDE4MnRwaXBxbnFvbzFwIn0.vWdz0wM8qWICZblz22hWGw';
      console.log("fetching: " + url + '/' + path + '/' + params + '.json?' + auth);
      fetch(url + '/' + path + '/' + params + '.json?' + auth)
        .then(response => {
          if (!response.ok) {
            throw onError(response);
          } else {
            return response;
          }
        })
        .then(response => response.json())
        .then(data => {
          console.log(data);
          dispatch({ type: FETCH_SUCCESS, data: mapResponse(data) });
        })
        .catch(error => {
          dispatch({ type: FETCH_FAIL, error: error });
        });
    }
  };

  return fetcher;

}

export const createAsyncPost = function(options) {
  const {
    url,
    path,
    label,
    mapResponse,
    onError,
  } = options;

  const queryString = require('query-string');

  // Types
  //

  const FETCH = `${label}/FETCH`;
  const FETCH_SUCCESS = `${label}/FETCH_SUCCESS`;
  const FETCH_FAIL = `${label}/FETCH_FAIL`;

  // Actions
  // TODO: create more actions as necessary

  const poster = function(params = {}) {
    return (dispatch) => {
      dispatch({
        type: FETCH,
        params
      });

      //TODO:
      let auth = 'access_token=pk.eyJ1IjoiaXRzZXRhaSIsImEiOiJjaXNneGxxNHQwMDE4MnRwaXBxbnFvbzFwIn0.vWdz0wM8qWICZblz22hWGw';
      let body = JSON.stringify({"coordinates": params})
      console.log("posting: " + url + '/' + path + '?' + auth);
      console.log("json: ", body);
      fetch(url + '/' + path + '?' + auth, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body
      })
        .then(response => {
          if (!response.ok) {
            throw onError(response);
          } else {
            return response;
          }
        })
        .then(response => response.json())
        .then(data => {
          console.log(data);
          dispatch({ type: FETCH_SUCCESS, data: mapResponse(data) });
        })
        .catch(error => {
          dispatch({ type: FETCH_FAIL, error: error });
        });
    }
  };

  return poster;

}


