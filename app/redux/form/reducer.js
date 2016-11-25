import { UPDATE_TIME, UPDATE_LOCATION, SUBMIT_FORM, TOGGLE_PICKER, SHOW_LOCATION_RESULTS } from './action-types'

const initialState = {
  location: "Current Location",
  time: new Date(Date.now() + 30*60000).toString(),
  submittedData: false,
  togglePicker: false,
  locationResultsVisible: false
}

export default form = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_LOCATION:
      return {
        ...state,
        location: action.location,
        submittedData: action.submittedData
      }
    case UPDATE_TIME:
      return {
        ...state,
        time: action.time,
        timeString: action.timeString || "",
        submittedData: action.submittedData
      }
    case SUBMIT_FORM:
      return {
        ...state,
        submittedData: action.submittedData
      }
    case TOGGLE_PICKER:
      return {
        ...state,
        togglePicker: !state.togglePicker
      }
    case SHOW_LOCATION_RESULTS:
      return {
        ...state,
        locationResultsVisible: action.locationResultsVisible
      }
    default:
      return state
  }
}