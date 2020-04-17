import dayjs from 'dayjs';
import { Platform, Alert } from 'react-native';

export function isPlatformiOS() {
  return Platform.OS === 'ios';
}

export function isPlatformAndroid() {
  return Platform.OS === 'android';
}

export function nowStr() {
  return dayjs().format('H:mm');
}

export function isEmpty(obj) {

  // null and undefined are "empty"
  if (obj == null) return true;
  if (obj == 'indefined') return true;

  // Assume if it has a length property with a non-zero value
  // that that property is correct.
  if (obj.length > 0) return false;
  if (obj.length === 0) return true;

  // If it isn't an object at this point
  // it is empty, but it can't be anything *but* empty
  if (typeof obj !== "object") return true;

  // Otherwise, does it have any properties of its own?
  for (let key in obj) {
    if (hasOwnProperty.call(obj, key)) return false;
  }

  return true;
}

export function showAlert(title, description, onOkPress, okText, onCancelPress, cancelText) {
  return Alert.alert(title, description,
    [
      {
        text: okText,
        onPress: onOkPress
      },
      {
        text: cancelText,
        onPress: onCancelPress,
        style: 'cancel',
      },
    ],
  )
}

export default {
  isPlatformiOS,
  isPlatformAndroid,
  nowStr,
  isEmpty,
  showAlert
};
