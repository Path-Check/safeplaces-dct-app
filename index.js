/**
 * @format
 */

import NetInfo from '@react-native-community/netinfo';
import { AppRegistry } from 'react-native';

import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);

if (__DEV__) {
  import('./reactotron.config');
}

NetInfo.configure({
  // interval to check for internet reachability if was reachable
  reachabilityLongTimeout: 3600 * 1000, // 1hr
  // interval to cehck for internet reachability if wasn't reachable
  reachabilityShortTimeout: 60 * 1000, // 60s
  // internet reachability request timeout
  reachabilityRequestTimeout: 5 * 1000, // 5s
});
