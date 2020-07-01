import React, { useContext } from 'react';
import {
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { SvgXml } from 'react-native-svg';
import { useDispatch } from 'react-redux';

import PermissionsContext from '../../bt/PermissionsContext';
import onboardingCompleteAction from '../../store/actions/onboardingCompleteAction';
import { Typography } from '../../components/Typography';
import { useStatusBarEffect } from '../../navigation';

import { Icons, Images } from '../../assets';
import {
  Spacing,
  Buttons,
  Colors,
  Iconography,
  Typography as TypographyStyles,
} from '../../styles';

export const EnableExposureNotifications = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { exposureNotifications } = useContext(PermissionsContext);

  useStatusBarEffect('dark-content');

  const dispatchOnboardingComplete = () => {
    dispatch(onboardingCompleteAction());
  };

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
    <ImageBackground
      source={Images.BlueGradientBackground}
      style={styles.backgroundImage}>
      <View testID={'onboarding-permissions-screen'} style={styles.container}>
        <ScrollView style={styles.contentContainer}>
          <View style={styles.iconContainer}>
            <SvgXml xml={Icons.ExposureIcon} />
          </View>
          <Typography style={styles.headerText} testID='Header'>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.large,
    backgroundColor: Colors.invertedPrimaryBackground,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    flex: 1,
  },
  contentContainer: {
    paddingVertical: Spacing.large,
  },
  iconContainer: {
    ...Iconography.largeBlueIcon,
    marginBottom: Spacing.xHuge,
  },
  headerText: {
    ...TypographyStyles.header2,
    color: Colors.white,
    marginBottom: Spacing.small,
  },
  subheaderText: {
    ...TypographyStyles.mainContent,
    color: Colors.invertedText,
    marginBottom: Spacing.xHuge,
    marginTop: Spacing.xLarge,
  },
  footerContainer: {
    height: 'auto',
    width: '100%',
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
