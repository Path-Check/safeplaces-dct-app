import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet } from 'react-native';

import PermissionsContext from './PermissionsContext';
import { Screens } from '../navigation';
import { useStatusBarEffect } from '../navigation';
import DescriptionTemplate from '../views/common/DescriptionTemplate';

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

  return (
    <DescriptionTemplate
      iconXml={Icons.Bell}
      header={t('onboarding.notification_header')}
      headerStyle={styles.header}
      body={t('onboarding.notification_subheader')}
      bodyStyle={styles.body}
      primaryButtonLabel={t('label.launch_enable_notif')}
      primaryButtonOnPress={handleOnPressEnable}
      secondaryButtonLabel={t('onboarding.maybe_later')}
      secondaryButtonOnPress={handleOnPressMaybeLater}
      backgroundImage={Images.BlueGradientBackground}
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
