import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet } from 'react-native';

import PermissionsContext from './PermissionsContext';
import { Screens } from '../navigation';
import { useStatusBarEffect } from '../navigation';
import ExplanationScreen, {
  IconStyle,
} from '../views/common/ExplanationScreen';

import { Icons, Images } from '../assets';
import { Colors } from '../styles';

const NotificationsPermissions = (): JSX.Element => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { notification } = useContext(PermissionsContext);

  useStatusBarEffect('dark-content');

  const requestPermission = async () => {
    await notification.request();
  };

  const continueOnboarding = () => {
    navigation.navigate(Screens.EnableExposureNotifications);
  };

  const handleOnPressEnable = async () => {
    await requestPermission();
    continueOnboarding();
  };

  const handleOnPressMaybeLater = () => {
    continueOnboarding();
  };

  const explanationScreenContent = {
    backgroundImage: Images.BlueGradientBackground,
    icon: Icons.Bell,
    header: t('onboarding.notification_header'),
    body: t('onboarding.notification_subheader'),
    primaryButtonLabel: t('label.launch_enable_notif'),
    secondaryButtonLabel: t('onboarding.maybe_later'),
  };

  const explanationScreenStyles = {
    headerStyle: styles.header,
    bodyStyle: styles.body,
    iconStyle: IconStyle.Blue,
  };

  const explanationScreenActions = {
    primaryButtonOnPress: handleOnPressEnable,
    secondaryButtonOnPress: handleOnPressMaybeLater,
  };

  return (
    <ExplanationScreen
      explanationScreenContent={explanationScreenContent}
      explanationScreenStyles={explanationScreenStyles}
      explanationScreenActions={explanationScreenActions}
    />
  );
};

const styles = StyleSheet.create({
  header: {
    color: Colors.white,
  },
  body: {
    color: Colors.white,
  },
});

export default NotificationsPermissions;
