import Yaml from 'js-yaml';
import { Alert, Linking } from 'react-native';
import BackgroundTimer from 'react-native-background-timer';
import PushNotification from 'react-native-push-notification';

import { version as currentVersion } from '../../package.json';
import {
  APPSTORE_URL,
  PLAYSTORE_URL,
  VERSION_URL,
  YAML_LATEST_VERSION_KEY,
  YAML_MANDATORY_VERSION_KEY,
} from '../constants/versionCheck';
import languages from '../locales/languages';
import { isPlatformiOS, isVersionGreater } from '../Util';

const POLL_INTERVAL = 24 * 60 * 60 * 1000; //one day

const updateLink = isPlatformiOS() ? APPSTORE_URL : PLAYSTORE_URL;
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
    if (notificationShown) return;
    let mandatoryVersion, latestVersion;
    try {
      const response = await fetch(VERSION_URL);
      const responseText = await response.text();
      const parsedFile = Yaml.safeLoad(responseText);
      mandatoryVersion = parsedFile[YAML_MANDATORY_VERSION_KEY];
      latestVersion = parsedFile[YAML_LATEST_VERSION_KEY];
    } catch (err) {
      console.log(err);
      return;
    }

    if (!isVersionGreater(latestVersion, currentVersion)) return;

    const isMandatoryUpdate = isVersionGreater(
      mandatoryVersion,
      currentVersion,
    );
    this.showNotifications(isMandatoryUpdate);
  }

  static showNotifications(isMandatoryUpdate) {
    const updateOption = {
      text: languages.t('version_update.update'),
      onPress: () => {
        notificationShown = false;
        Linking.canOpenURL(updateLink).then(
          supported => supported && Linking.openURL(updateLink),
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

    const alertOptions = [updateOption];

    if (isMandatoryUpdate) {
      PushNotification.localNotification({
        title: languages.t('version_update.push_notification_title'),
        message: languages.t('version_update.push_notification_message'),
      });
    } else {
      alertOptions.push(laterOption);
    }

    notificationShown = true;
    Alert.alert(
      languages.t('version_update.alert_label'),
      languages.t('version_update.alert_sublabel'),
      alertOptions,
    );
  }
}
