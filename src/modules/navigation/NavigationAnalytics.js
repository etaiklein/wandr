
import {PUSH_ROUTE, POP_ROUTE, SWITCH_TAB} from './NavigationState';

export default function NavigationAnalytics(state, action) {
  switch (action.type) {
    case PUSH_ROUTE:
      return {
        event: 'screenView',
        fields: {screenName: action.payload.key}
      };
    case POP_ROUTE: {
      const screenName = getActiveScreenName(state, state.getIn(['navigationState', 'index']));
      return {event: 'screenView', fields: {screenName}};
    }
    case SWITCH_TAB: {
      const screenName = getActiveScreenName(state, action.payload);
      return {event: 'screenView', fields: {screenName}};
    }
    default:
      return null;
  }
}

function getActiveScreenName(state, tabIndex) {
  console.log('tabIndex', tabIndex);
  const currentTab = state.getIn(['navigationState', 'children', tabIndex]);
  return currentTab.get('children').last().get('key');
}
