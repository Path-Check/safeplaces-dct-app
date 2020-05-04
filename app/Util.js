import dayjs from 'dayjs';
import { Platform } from 'react-native';
import semver from 'semver';

export function isPlatformiOS() {
  return Platform.OS === 'ios';
}

export function isPlatformAndroid() {
  return Platform.OS === 'android';
}

export function nowStr() {
  return dayjs().format('H:mm');
}

export const isVersionGreater = (source, target) => semver.gt(source, target);

export default {
  isPlatformiOS,
  isPlatformAndroid,
  nowStr,
};
