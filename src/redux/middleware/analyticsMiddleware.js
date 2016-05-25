import {sendEvent} from '../../utils/analytics';
import {defer, flatten, compact} from 'lodash';

import NavigationAnalytics from '../../modules/navigation/NavigationAnalytics';

const handlers = [
  NavigationAnalytics,
  //...
];

/**
 * Redux middleware
 */
export default function analyticsMiddleware(store) {
  return next => action => {
    next(action);
    sendActionAnalyticsEvent(store.getState(), action);
  };
}

/**
 * Maps action to analytics event and sends it to the
 * analytics bridge. If no analytics event is found for
 * given action, nothing is sent
 */
function sendActionAnalyticsEvent(state, action) {
  const events = getActionAnalyticsEvents(state, action);
  if (events && events.length) {
    defer(() => events.forEach(event => sendEvent(event.event, event.fields)));
  }
}

function getActionAnalyticsEvents(state, action) {
  return compact(flatten(handlers.map(handler => handler(state, action))));
}
