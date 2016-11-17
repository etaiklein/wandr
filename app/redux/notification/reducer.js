import { NOTIFICATION_RECEIVED, NOTIFICATION_SENT } from './action-types'

const initialState = {
  notify: true
}

export default notification = (state = initialState, action) => {
  switch (action.type) {
    case NOTIFICATION_RECEIVED:
      return {
        ...state,
        notify: true
      }
    case NOTIFICATION_SENT:
      return {
        ...state,
        notify: false
      }
    default:
      return state
  }
}