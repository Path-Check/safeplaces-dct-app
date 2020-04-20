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
  showAlert
};
