import { UPDATE_LOCATION, UPDATE_TIME, SUBMIT_FORM, TOGGLE_PICKER } from './action-types'

export const updateTime = (time, timeString) => {
  return {
    type: UPDATE_TIME,
    submittedData: false,
    time: time,
    timeString: timeString
  }
}


export const togglePicker = () => {
  return {
    type: TOGGLE_PICKER,
  }
}

export const updateLocation = (location) => {
  return {
    type: UPDATE_LOCATION,
    submittedData: false,
    location: location,
  }
}


export const submitForm = () => {
  return {
    type: SUBMIT_FORM,
    submittedData: true,
  }
}