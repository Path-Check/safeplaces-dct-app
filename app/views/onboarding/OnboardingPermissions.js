import React, { useContext } from 'react';
import {
  Dimensions,
  ImageBackground,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useDispatch } from 'react-redux';

import { Icons, Images } from '../../assets';
import { Button } from '../../components/Button';
import { Typography } from '../../components/Typography';
import Colors from '../../constants/colors';
import { PARTICIPATE } from '../../constants/storage';
import { Theme } from '../../constants/themes';
import { SetStoreData } from '../../helpers/General';
import languages from '../../locales/languages';
import PermissionsContext, { PermissionStatus } from '../../PermissionsContext';
import onboardingCompleteAction from '../../store/actions/onboardingCompleteAction';
import { sharedStyles } from './styles';
import fontFamily from '../../constants/fonts';

const width = Dimensions.get('window').width;

export const OnboardingPermissions = ({ route, navigation }) => {
  const { location, notification, authSubscription } = useContext(
    PermissionsContext,
  );

  const handleRequestNotifications = async () => {
    await notification.request();
    moveToNextStep();
  }
  
  const dispatch = useDispatch();
  const dispatchOnboardingComplete = () => dispatch(onboardingCompleteAction());

  const handleRequestLocation = async () => {
    await location.request();
    await handleRequestAuthSubscription()
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
    buttonLabel: languages.t('label.launch_enable_notif')
  }
  const locationStep = {
    header: languages.t('onboarding.location_header'),
    subHeader: languages.t('onboarding.location_subheader'),
    nextStepParam: null,
    handleButtonPress: handleRequestLocation,
    icon: Icons.LocationPin,
    buttonLabel: languages.t('label.launch_allow_location')
  }
  const steps = {
    notification: notificationStep,
    location: locationStep,
  }
  const currentStep = steps[route.params.step]
  const { header, subHeader, icon, nextStepParam, handleButtonPress, buttonLabel } = currentStep;

  const moveToNextStep = () => {
    if (nextStepParam) {
      navigation.push('OnboardingPermissions', {
        step: nextStepParam
      })
    } else {
      completeOnboarding()
    }
  };

  const onSkipStep = () => {
    moveToNextStep()
  };

  const completeOnboarding = () => {
    SetStoreData(PARTICIPATE, location.status === PermissionStatus.GRANTED);
    dispatchOnboardingComplete();
    navigation.replace('Main');
  }

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
            <View style={styles.iconCircle}>
              <SvgXml
                xml={icon}
                width={30}
                height={30}
              />
            </View>
            <Typography style={styles.headerText}>
              {header}
            </Typography>
            <Typography style={styles.subheaderText}>
              {subHeader}
            </Typography>
          </View>
        </View>
        <View style={sharedStyles.footerContainer}>
          <Button
            label={'Maybe Later'}
            secondary
            style={styles.marginBottom}
            onPress={onSkipStep}
            testID={'onboarding-permissions-button'}
          />
          <Button
            label={buttonLabel}
            onPress={handleButtonPress}
            testID={'onboarding-permissions-button'}
          />
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
  },
  contentContainer: {
    width: width * 0.9,
    flex: 1,
    alignSelf: 'center',
    marginTop: 70,
  },
  headerText: {
    lineHeight: 32,
    color: Colors.WHITE,
    fontSize: 26,
    fontFamily: fontFamily.primaryRegular,
  },
  subheaderText: {
    color: Colors.WHITE,
    marginTop: 24,
    lineHeight: 24,
    fontSize: 18,
    fontFamily: fontFamily.primaryRegular,
  },
  marginBottom: {
    marginBottom: 21,
  },
  iconCircle: {
    height: 70,
    width: 70,
    backgroundColor: Colors.WHITE,
    borderRadius: 1000,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  }
});
