import React, { useContext } from 'react';
import {
  TouchableOpacity,
  ImageBackground,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { SvgXml } from 'react-native-svg';

import { Typography } from '../../components/Typography';
import { Theme } from '../../constants/themes';
import ExposureNotificationContext from '../../bt/ExposureNotificationContext';
import { useDispatch } from 'react-redux';
import onboardingCompleteAction from '../../store/actions/onboardingCompleteAction';

import {
  Spacing,
  Buttons,
  Colors,
  Typography as TypographyStyles,
} from '../../styles';
import { Icons, Images } from '../../assets';

export const EnableExposureNotifications = (): JSX.Element => {
  const { requestENAuthorization } = useContext(ExposureNotificationContext);
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const dispatchOnboardingComplete = () => dispatch(onboardingCompleteAction());

  const buttonLabel = t('label.launch_enable_exposure_notif');
  const disableButtonLabel = t('label.launch_disable_exposure_notif');
  const subTitleText = t('label.launch_exposure_notif_subheader');
  const titleText = t('label.launch_exposure_notif_header');

  const handleOnPressEnable = () => {
    requestENAuthorization();
    dispatchOnboardingComplete();
  };

  const handleOnPressDontEnable = () => {
    dispatchOnboardingComplete();
  };

  return (
    <Theme use='violet'>
      <ImageBackground
        source={Images.LaunchScreenBackground}
        style={styles.backgroundImage}>
        <StatusBar
          barStyle='light-content'
          backgroundColor='transparent'
          translucent
        />

        <View
          testID={'onboarding-permissions-screen'}
          style={styles.mainContainer}>
          <View style={styles.contentContainer}>
            <View style={styles.iconContainer}>
              <SvgXml xml={Icons.ExposureIcon} />
            </View>
            <Typography
              style={styles.headerText}
              use={'headline2'}
              testID='Header'>
              {titleText}
            </Typography>
            <Typography style={styles.subheaderText}>{subTitleText}</Typography>
          </View>

          <View style={styles.footerContainer}>
            <TouchableOpacity
              style={styles.dontEnableButton}
              onPress={handleOnPressDontEnable}
              testID={'onboarding-permissions-disable-button'}>
              <Typography style={styles.dontEnableButtonText}>
                {disableButtonLabel}
              </Typography>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.enableButton}
              onPress={handleOnPressEnable}
              testID={'onboarding-permissions-button'}>
              <Typography style={styles.enableButtonText}>
                {buttonLabel}
              </Typography>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </Theme>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    padding: Spacing.large,
  },
  contentContainer: {
    flex: 3,
    justifyContent: 'center',
  },
  footerContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-around',
  },
  headerText: {
    ...TypographyStyles.header2,
    color: Colors.white,
  },
  iconContainer: {
    paddingBottom: Spacing.large,
  },
  subheaderText: {
    ...TypographyStyles.mainContent,
    color: Colors.invertedText,
  },
  enableButton: {
    ...Buttons.largeWhite,
  },
  enableButtonText: {
    ...TypographyStyles.buttonTextDark,
  },
  dontEnableButton: {
    ...Buttons.largeWhiteOutline,
  },
  dontEnableButtonText: {
    ...TypographyStyles.buttonTextLight,
  },
});
