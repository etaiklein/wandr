import { UPDATE_FORM, SUBMIT_FORM } from './action-types'

export const updateForm = (formData) => {
  return {
    type: UPDATE_FORM,
    submittedData: false,
    formData,
  }
}

export const submitForm = () => {
  return {
    type: SUBMIT_FORM,
    submittedData: true,
  }
}