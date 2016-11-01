export const createAsyncFetch = function(options) {
  const {
    url,
    path,
    action_types,
    mapResponse,
    onError,
  } = options;

  const queryString = require('query-string');

  const fetcher = function(params = {}) {
    return (dispatch) => {
      dispatch({
        type: action_types[0],
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
          dispatch({ type: action_types[1], data: mapResponse(data) });
        })
        .catch(error => {
          dispatch({ type: action_types[2], error: error });
        });
    }
  };

  return fetcher;

}

export const createAsyncPost = function(options) {
  const {
    url,
    path,
    action_types,
    mapResponse,
    onError,
  } = options;

  const queryString = require('query-string');

  // Actions

  const poster = function(params = {}) {
    return (dispatch) => {
      dispatch({
        type: action_types[0],
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
          dispatch({ type: action_types[1], data: mapResponse(data) });
        })
        .catch(error => {
          dispatch({ type: action_types[2], error: error });
        });
    }
  };

  return poster;

}


