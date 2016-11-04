import { NOTIFICATION_RECEIVED, NOTIFICATION_SENT } from './action-types'

export const notificationReceived = () => {
  return {
    type: NOTIFICATION_RECEIVED,
    notify: true
  }
}

export const notificationSent = () => {
  return {
    type: NOTIFICATION_SENT,
    notify: false
  }
}