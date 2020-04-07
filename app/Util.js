import { Platform } from 'react-native';
import Moment from 'moment';

export function isPlatformiOS() {
  return Platform.OS === 'ios';
}

export function isPlatformAndroid() {
  return Platform.OS === 'android';
}

export function nowStr() {
  return Moment(new Date()).format('H:mm');
}

export default {
  isPlatformiOS,
  isPlatformAndroid,
  nowStr,
};
