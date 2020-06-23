import dayjs from 'dayjs';
import { Platform } from 'react-native';
import semver from 'semver';

export function isPlatformiOS(): boolean {
  return Platform.OS === 'ios';
}

export function isPlatformAndroid(): boolean {
  return Platform.OS === 'android';
}

export function nowStr(): string {
  return dayjs().format('H:mm');
}

export const isVersionGreater = (source: string, target: string): boolean =>
  semver.gt(source, target);

export default {
  isPlatformiOS,
  isPlatformAndroid,
  nowStr,
};
