import { UPDATE_FORM, SUBMIT_FORM } from './action-types'

const initialState = {
  formData: {},
  submittedData: {}
}

export default form = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_FORM:
      return Object.assign({}, state, {
        formData: action.formData,
        submittedData: action.submittedData
      })
    case SUBMIT_FORM:
      return Object.assign({}, state, {
        submittedData: action.submittedData
      })
    default:
      return state
  }
}