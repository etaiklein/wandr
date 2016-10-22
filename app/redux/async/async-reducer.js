const createAsyncReducer = function(label) {
  
  // 1Types

  const FETCH = `${label}/FETCH`;
  const FETCH_SUCCESS = `${label}/FETCH_SUCCESS`;
  const FETCH_FAIL = `${label}/FETCH_FAIL`;

  // Reducer

  const initialState = {
    loaded: false,
    loading: false,
    data: [],
  };

  const reducer = function(state = initialState, action = {}) {
    const {
      type,
      data,
      params,
      error,
    } = action;

    switch (type) {
      case FETCH:
        return {
          ...state,
          loaded: false,
          loading: true,
          lastParams: params,
        };
      case FETCH_SUCCESS:
        return {
          ...state,
          loaded: true,
          loading: false,
          error: null,
          data,
        };
      case FETCH_FAIL:
        return {
          ...state,
          loading: false,
          error,
        };
      default:
        return state;
    }
  };

  return reducer;
}

export default createAsyncReducer;