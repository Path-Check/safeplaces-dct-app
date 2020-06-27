import React, { useContext } from 'react';
import {
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { SvgXml } from 'react-native-svg';

import { Typography } from '../../components/Typography';
import { Theme } from '../../constants/themes';
import PermissionsContext from '../../bt/PermissionsContext';
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
  const { exposureNotifications } = useContext(PermissionsContext);
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const dispatchOnboardingComplete = () => dispatch(onboardingCompleteAction());

  const buttonLabel = t('label.launch_enable_exposure_notif');
  const disableButtonLabel = t('label.launch_disable_exposure_notif');
  const subTitleText = t('label.launch_exposure_notif_subheader');
  const titleText = t('label.launch_exposure_notif_header');

  const handleOnPressEnable = () => {
    exposureNotifications.request();
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
          <ScrollView style={styles.contentContainer}>
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
          </ScrollView>

          <View style={styles.footerContainer}>
            <TouchableOpacity
              style={styles.enableButton}
              onPress={handleOnPressEnable}
              testID={'onboarding-permissions-button'}>
              <Typography style={styles.enableButtonText}>
                {buttonLabel}
              </Typography>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dontEnableButton}
              onPress={handleOnPressDontEnable}
              testID={'onboarding-permissions-disable-button'}>
              <Typography style={styles.dontEnableButtonText}>
                {disableButtonLabel}
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
    paddingTop: Spacing.large,
  },
  footerContainer: {
    height: 'auto',
    width: '100%',
  },
  headerText: {
    ...TypographyStyles.header2,
    color: Colors.white,
    marginBottom: Spacing.small,
  },
  iconContainer: {
    paddingBottom: Spacing.large,
  },
  subheaderText: {
    ...TypographyStyles.mainContent,
    color: Colors.invertedText,
    marginBottom: Spacing.xHuge,
  },
  enableButton: {
    ...Buttons.largeWhite,
  },
  enableButtonText: {
    ...TypographyStyles.buttonTextDark,
  },
  dontEnableButton: {
    ...Buttons.largeSecondary,
  },
  dontEnableButtonText: {
    ...TypographyStyles.buttonTextLight,
  },
});
