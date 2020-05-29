import React, { useContext, useState } from 'react';
import {
  Dimensions,
  ImageBackground,
  Platform,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SvgXml } from 'react-native-svg';

import { Icons, Images } from '../../assets';
import { Button } from '../../components/Button';
import { Typography } from '../../components/Typography';
import Colors from '../../constants/colors';
import { ONBOARDING_DONE, PARTICIPATE } from '../../constants/storage';
import { Theme } from '../../constants/themes';
import { isGPS } from '../../COVIDSafePathsConfig';
import { SetStoreData } from '../../helpers/General';
import languages from '../../locales/languages';
import PermissionsContext, { PermissionStatus } from '../../PermissionsContext';
import { sharedStyles } from './styles';

const width = Dimensions.get('window').width;

export const OnboardingPermissions = ({ navigation }) => {
  const { location, notification, authSubscription } = useContext(
    PermissionsContext,
  );
  const [currentStep, setCurrentStep] = useState(0);
  const isiOS = Platform.OS === 'ios';
  const isDev = __DEV__;

  const moveToNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const onSkipStep = () => {
    moveToNextStep();
  };

  const handleRequestLocation = async () => {
    await location.request();
    moveToNextStep();
  };

  const handleRequestNotifications = async () => {
    await notification.request();
    moveToNextStep();
  };

  const handleRequestAuthSubscription = async () => {
    await authSubscription.request();
    moveToNextStep();
  };

  const handleOnPressDone = () => {
    SetStoreData(PARTICIPATE, location.status === PermissionStatus.GRANTED);
    SetStoreData(ONBOARDING_DONE, true);
    navigation.replace('Main');
  };

  const locationStep = {
    titleText: languages.t('label.launch_enable_location'),
    subTitleText: languages.t('label.launch_subheader'),
    indicatorText: languages.t('label.launch_access_location'),
    status: location.status,
    buttonLabel: languages.t('label.launch_enable_location'),
    handleButtonPress: handleRequestLocation,
    testID: 'location-indicator',
  };
  const notificationStep = {
    titleText: languages.t('label.launch_notif_header'),
    subTitleText: languages.t('label.launch_notif_subheader'),
    indicatorText: languages.t('label.launch_notification_access'),
    status: notification.status,
    buttonLabel: languages.t('label.launch_enable_notif'),
    handleButtonPress: handleRequestNotifications,
    testID: 'notification-indicator',
  };
  const authSubscriptionStep = {
    titleText: languages.t('label.launch_authority_header'),
    subTitleText: languages.t('label.launch_authority_subheader'),
    indicatorText: languages.t('label.launch_authority_access'),
    status: authSubscription.status,
    buttonLabel: languages.t('label.launch_enable_auto_subscription'),
    handleButtonPress: handleRequestAuthSubscription,
    testID: 'auth-subscription-indicator',
  };
  const doneStep = {
    titleText: languages.t('label.launch_done_header'),
    subTitleText: languages.t('label.launch_done_subheader'),
    buttonLabel: languages.t('label.launch_finish_set_up'),
    handleButtonPress: handleOnPressDone,
  };

  const determineSteps = (isGPS, isiOS, isDev) => {
    const steps = [];
    if (isGPS) {
      steps.push(locationStep);
    }
    if (isiOS) {
      steps.push(notificationStep);
    }
    if (isDev) {
      steps.push(authSubscriptionStep);
    }
    return steps;
  };

  const steps = determineSteps(isGPS, isiOS, isDev);

  const headerThemeStyle = 'headline2';
  const subTitleStyle = styles.subheaderText;

  const finishedAllSteps = currentStep >= steps.length;

  const {
    titleText,
    subTitleText,
    buttonLabel,
    handleButtonPress,
  } = finishedAllSteps ? doneStep : steps[currentStep];

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
            <Typography
              style={styles.headerText}
              use={headerThemeStyle}
              testID='Header'>
              {titleText}
            </Typography>
            <Typography style={subTitleStyle} use={'body3'}>
              {subTitleText}
            </Typography>
            {finishedAllSteps ? null : <SkipStepButton onPress={onSkipStep} />}

            <View style={styles.statusContainer}>
              {steps.map(({ testID, indicatorText, status }, idx) => (
                <PermissionIndicator
                  key={`indicator-${idx}`}
                  title={indicatorText}
                  status={status}
                  testID={testID}
                />
              ))}
              <View style={styles.spacer} />
            </View>
          </View>
        </View>
        <View style={sharedStyles.footerContainer}>
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

const SkipStepButton = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Typography style={styles.skipThisStepBtn} use={'body1'}>
        {languages.t('label.skip_this_step')}
      </Typography>
    </TouchableOpacity>
  );
};

const PermissionIndicator = ({ testID, title, status }) => {
  const icons = {
    [PermissionStatus.UNKNOWN]: Icons.PermissionUnknown,
    [PermissionStatus.GRANTED]: Icons.PermissionGranted,
    [PermissionStatus.DENIED]: Icons.PermissionDenied,
  };

  const icon = icons[status] || Icons.PermissionUnknown;
  return (
    <View testID={testID}>
      <View style={styles.permissionContainer}>
        <Typography style={styles.permissionTitle} use={'body2'}>
          {title}
        </Typography>
        <SvgXml
          style={styles.permissionIcon}
          xml={icon}
          width={30}
          height={30}
        />
      </View>
      <View style={styles.divider} />
    </View>
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
    justifyContent: 'center',
    alignSelf: 'center',
  },
  headerText: {
    color: Colors.WHITE,
  },
  subheaderText: {
    color: Colors.WHITE,
    marginTop: '3%',
    width: width * 0.55,
  },
  statusContainer: {
    marginTop: '5%',
  },
  divider: {
    backgroundColor: Colors.DIVIDER,
    height: 1,
    marginVertical: '3%',
  },
  spacer: {
    marginVertical: '5%',
  },
  permissionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  permissionTitle: {
    color: Colors.WHITE,
    alignSelf: 'center',
    marginRight: 8,
    flex: 1,
  },
  permissionIcon: {
    alignSelf: 'center',
  },
  skipThisStepBtn: {
    color: Colors.DIVIDER,
    paddingTop: 15,
  },
});
