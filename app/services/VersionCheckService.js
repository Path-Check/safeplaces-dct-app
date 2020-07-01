import { Alert, Linking } from 'react-native';
import BackgroundTimer from 'react-native-background-timer';
import VersionCheck from 'react-native-version-check';

import languages from '../locales/languages';

const POLL_INTERVAL = 24 * 60 * 60 * 1000; //one day

let isPollStarted = false;
//make sure we show only one notification
let notificationShown = false;

export default class VersionCheckService {
  static start() {
    if (!isPollStarted) {
      this.checkUpdate();
      // currenly BackgroundTimer is not used anywhere else.
      // But this thing should be called only once, otherwise it behaves not as expected.
      // It worths making a separate service.
      BackgroundTimer.runBackgroundTimer(
        () => this.checkUpdate(),
        POLL_INTERVAL,
      );
      isPollStarted = true;
    }
  }

  static stop() {
    BackgroundTimer.stopBackgroundTimer();
  }

  static async checkUpdate() {
    const isUpdateNeeded = await VersionCheck.needUpdate();
    if (isUpdateNeeded.isNeeded) {
      this.showNotifications(isUpdateNeeded);
    }
  }

  static showNotifications({ storeUrl }) {
    const updateOption = {
      text: languages.t('version_update.update'),
      onPress: () => {
        notificationShown = false;
        Linking.canOpenURL(storeUrl).then(
          supported => supported && Linking.openURL(storeUrl),
          err => console.log(err),
        );
      },
    };
    const laterOption = {
      text: languages.t('version_update.later'),
      onPress: () => {
        notificationShown = false;
        console.log('User does not want to update the app');
      },
      style: 'cancel',
    };

    const alertOptions = [updateOption, laterOption];

    // This could be use it in the future
    //   PushNotification.localNotification({
    //     title: languages.t('version_update.push_notification_title'),
    //     message: languages.t('version_update.push_notification_message'),
    //   });
    //

    notificationShown = true;
    Alert.alert(
      languages.t('version_update.alert_label'),
      languages.t('version_update.alert_sublabel'),
      alertOptions,
    );
  }
}
