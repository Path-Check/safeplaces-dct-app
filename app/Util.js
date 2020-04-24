import dayjs from 'dayjs';
import { Platform } from 'react-native';

export function isPlatformiOS() {
  return Platform.OS === 'ios';
}

export function isPlatformAndroid() {
  return Platform.OS === 'android';
}

export function nowStr() {
  return dayjs().format('H:mm');
}

export const isVersionGreater = (source, target) =>
  source
    .split('.')
    .some((val, index) => parseInt(val) > parseInt(target.split('.')[index]));

export default {
  isPlatformiOS,
  isPlatformAndroid,
  nowStr,
};
