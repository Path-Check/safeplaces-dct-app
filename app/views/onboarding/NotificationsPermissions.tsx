import React, { useContext } from 'react';
import {
  ImageBackground,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { SvgXml } from 'react-native-svg';

import PermissionsContext from '../../gps/PermissionsContext';
import { Screens } from '../../navigation';
import { Typography } from '../../components/Typography';
import { useStatusBarEffect } from '../../navigation';

import { Icons, Images } from '../../assets';
import {
  Buttons,
  Spacing,
  Colors,
  Iconography,
  Typography as TypographyStyles,
} from '../../styles';

const NotificationsPermissions = (): JSX.Element => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { notification } = useContext(PermissionsContext);

  useStatusBarEffect('light-content');

  const requestPermission = async () => {
    await notification.request();
  };

  const continueOnboarding = () => {
    navigation.navigate(Screens.OnboardingLocationPermissions);
  };

  const handleOnPressEnable = async () => {
    await requestPermission();
    continueOnboarding();
  };

  const handleOnPressMaybeLater = () => {
    continueOnboarding();
  };

  return (
    <ImageBackground
      source={Images.BlueGradientBackground}
      style={styles.backgroundImage}>
      <View style={styles.container}>
        <ScrollView
          alwaysBounceVertical={false}
          contentContainerStyle={{ paddingBottom: Spacing.large }}>
          <View style={styles.iconCircle}>
            <SvgXml
              xml={Icons.Bell}
              accessible
              accessibilityLabel={t('label.bell_icon')}
              width={30}
              height={30}
            />
          </View>
          <Typography style={styles.headerText}>
            {t('onboarding.notification_header')}
          </Typography>
          <View style={{ height: Spacing.medium }} />
          <Typography style={styles.contentText}>
            {t('onboarding.notification_subheader')}
          </Typography>
        </ScrollView>
        <TouchableOpacity
          onPress={handleOnPressEnable}
          style={styles.enableButton}>
          <Typography style={styles.enableButtonText}>
            {t('label.launch_enable_notif')}
          </Typography>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleOnPressMaybeLater}
          style={styles.maybeLaterButton}>
          <Typography style={styles.maybeLaterButtonText}>
            {t('onboarding.maybe_later')}
          </Typography>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.large,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    flex: 1,
  },
  iconCircle: {
    ...Iconography.largeBlueIcon,
  },
  headerText: {
    ...TypographyStyles.header2,
    color: Colors.white,
  },
  contentText: {
    ...TypographyStyles.mainContent,
    color: Colors.white,
  },
  enableButton: {
    ...Buttons.largeWhite,
  },
  enableButtonText: {
    ...TypographyStyles.buttonTextDark,
  },
  maybeLaterButton: {
    ...Buttons.largeTransparent,
  },
  maybeLaterButtonText: {
    ...TypographyStyles.buttonTextLight,
  },
});

export default NotificationsPermissions;
