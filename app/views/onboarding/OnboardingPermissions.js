import React, { useContext, useState } from 'react';
import {
  TouchableOpacity,
  ImageBackground,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useDispatch } from 'react-redux';

import { Typography } from '../../components/Typography';
import { PARTICIPATE } from '../../constants/storage';
import { Theme } from '../../constants/themes';
import { SetStoreData } from '../../helpers/General';
import languages from '../../locales/languages';
import PermissionsContext, {
  PermissionStatus,
} from '../../gps/PermissionsContext';
import onboardingCompleteAction from '../../store/actions/onboardingCompleteAction';

import { sharedStyles } from './styles';
import { Icons, Images } from '../../assets';
import {
  Spacing,
  Buttons,
  Colors,
  Typography as TypographyStyles,
} from '../../styles';

export const OnboardingPermissions = () => {
  const isiOS = Platform.OS === 'ios';
  const [step, setStep] = useState(isiOS ? 'notification' : 'location');
  const { location, notification, authSubscription } = useContext(
    PermissionsContext,
  );

  const handleRequestNotifications = async () => {
    await notification.request();
    moveToNextStep();
  };

  const dispatch = useDispatch();
  const dispatchOnboardingComplete = () => dispatch(onboardingCompleteAction());

  const handleRequestLocation = async () => {
    await location.request();
    await handleRequestAuthSubscription();
    moveToNextStep();
  };

  const handleRequestAuthSubscription = async () => {
    await authSubscription.request();
    moveToNextStep();
  };

  const notificationStep = {
    header: languages.t('onboarding.notification_header'),
    subHeader: languages.t('onboarding.notification_subheader'),
    nextStepParam: 'location',
    handleButtonPress: handleRequestNotifications,
    icon: Icons.Bell,
    buttonLabel: languages.t('label.launch_enable_notif'),
  };
  const locationStep = {
    header: languages.t('onboarding.location_header'),
    subHeader: languages.t('onboarding.location_subheader'),
    nextStepParam: null,
    handleButtonPress: handleRequestLocation,
    icon: Icons.LocationPin,
    buttonLabel: languages.t('label.launch_allow_location'),
  };
  const steps = {
    notification: notificationStep,
    location: locationStep,
  };
  const currentStep = steps[step];
  const {
    header,
    subHeader,
    icon,
    nextStepParam,
    handleButtonPress,
    buttonLabel,
  } = currentStep;

  const moveToNextStep = () => {
    if (nextStepParam) {
      setStep(nextStepParam);
    } else {
      completeOnboarding();
    }
  };

  const handleOnPressMaybeLater = () => {
    moveToNextStep();
  };

  const completeOnboarding = () => {
    SetStoreData(PARTICIPATE, location.status === PermissionStatus.GRANTED);
    dispatchOnboardingComplete();
  };

  const dontEnableText = 'Maybe Later';

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
            <View style={[sharedStyles.iconCircle, styles.iconCircle]}>
              <SvgXml xml={icon} width={30} height={30} />
            </View>
            <Typography style={styles.headerText}>{header}</Typography>
            <Typography style={styles.subheaderText}>{subHeader}</Typography>
          </View>
          <View style={styles.footerContainer}>
            <TouchableOpacity
              style={styles.dontEnableButton}
              onPress={handleOnPressMaybeLater}
              testID={'onboarding-permissions-skip-button'}>
              <Typography style={styles.dontEnableButtonText}>
                {dontEnableText}
              </Typography>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.enableButton}
              onPress={handleButtonPress}
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
    color: Colors.invertedText,
  },
  subheaderText: {
    ...TypographyStyles.mainContent,
    color: Colors.invertedText,
    paddingTop: Spacing.medium,
  },
  iconCircle: {
    backgroundColor: Colors.white,
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
