import { Platform } from 'react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import { PermissionStatus } from '../permissionStatus';

export default class NotificationService {
  static async configure(notificationStatus) {
    if (notificationStatus === PermissionStatus.GRANTED) {
      PushNotification.configure({
        // (required) Called when a remote or local notification is opened or received
        onNotification(notification) {
          console.log('NOTIFICATION:', notification);
          // required on iOS only (see fetchCompletionHandler docs: https://github.com/react-native-community/react-native-push-notification-ios)
          notification.finish(PushNotificationIOS.FetchResult.NoData);
        },
        // Setting the permissions to true causes a crash on Android, because that configuration requires Firebase
        // https://github.com/zo0r/react-native-push-notification#usage
        requestPermissions: Platform.OS === 'ios',
      });
    }
  }
}
