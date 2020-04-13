import { Platform } from 'react-native';
import dayjs from 'dayjs';

export function isPlatformiOS() {
  return Platform.OS === 'ios';
}

export function isPlatformAndroid() {
  return Platform.OS === 'android';
}

export function nowStr() {
  return dayjs().format('H:mm');
}

export default {
  isPlatformiOS,
  isPlatformAndroid,
  nowStr,
};
