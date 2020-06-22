import React, { useContext } from 'react';
import PermissionsContext from '../../gps/PermissionsContext';

import { Icons, Images } from '../../assets';

import OnboardingTemplate from './OnboardingTemplate';
import { useTranslation } from 'react-i18next';
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
} from 'react-navigation';
import { Screens } from '../../navigation';

type OnboardingNotificationsProps = {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
};

const OnboardingNotifications = ({
  navigation,
}: OnboardingNotificationsProps): JSX.Element => {
  const { notification } = useContext(PermissionsContext);

  const requestNotifications = async () => {
    await notification.request();
    continueOnboarding();
  };

  const continueOnboarding = () =>
    navigation.navigate(Screens.OnboardingLocationPermissions);

  const { t } = useTranslation();

  return (
    <OnboardingTemplate
      background={Images.LaunchScreenBackground}
      theme={'dark'}
      iconXml={Icons.Bell}
      title={t('onboarding.notification_header')}
      body={t('onboarding.notification_subheader')}
      primaryButtonLabel={t('label.launch_enable_notif')}
      primaryButtonOnPress={requestNotifications}
      secondaryButtonLabel={t('onboarding.maybe_later')}
      secondaryButtonOnPress={continueOnboarding}
    />
  );
};

export default OnboardingNotifications;
