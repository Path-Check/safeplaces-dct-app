import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  ImageBackground,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  PERMISSIONS,
  RESULTS,
  check,
  checkNotifications,
  request,
  requestNotifications,
} from 'react-native-permissions';
import { SvgXml } from 'react-native-svg';

import { isPlatformiOS } from './../../Util';
import { Icons, Images } from '../../assets';
import { Button } from '../../components/Button';
import { Typography } from '../../components/Typography';
import Colors from '../../constants/colors';
import { PARTICIPATE } from '../../constants/storage';
import { Theme } from '../../constants/themes';
import { tracingStrategy } from '../../COVIDSafePathsConfig';
import { SetStoreData } from '../../helpers/General';
import languages from '../../locales/languages';
import { HCAService } from '../../services/HCAService';
import { sharedStyles } from './styles';

const width = Dimensions.get('window').width;

const PermissionStatusEnum = {
  UNKNOWN: 0,
  GRANTED: 1,
  DENIED: 2,
};

const StepEnum = {
  LOCATION: 0,
  NOTIFICATIONS: 1,
  HCA_SUBSCRIPTION: 2,
  DONE: 3,
};

const PermissionDescription = ({ title, status }) => {
  let icon;
  switch (status) {
    case PermissionStatusEnum.UNKNOWN:
      icon = Icons.PermissionUnknown;
      break;
    case PermissionStatusEnum.GRANTED:
      icon = Icons.PermissionGranted;
      break;
    case PermissionStatusEnum.DENIED:
      icon = Icons.PermissionDenied;
      break;
  }

  return (
    <View style={styles.permissionContainer}>
      <Typography style={styles.permissionTitle} use={'body2'}>
        {title}
      </Typography>
      <SvgXml style={styles.permissionIcon} xml={icon} width={30} height={30} />
    </View>
  );
};

const Onboarding = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState(StepEnum.LOCATION);
  const [notificationPermission, setNotificationPermission] = useState(
    PermissionStatusEnum.UNKNOWN,
  );
  const [locationPermission, setLocationPermission] = useState(
    PermissionStatusEnum.UNKNOWN,
  );
  const [authSubscriptionStatus, setAuthSubscriptionStatus] = useState(
    PermissionStatusEnum.UNKNOWN,
  );

  useEffect(() => {
    checkLocationStatus();
    isPlatformiOS() && checkNotificationStatus();
    __DEV__ && checkSubsriptionStatus();
  });

  const isLocationChecked = () => {
    return locationPermission !== PermissionStatusEnum.UNKNOWN;
  };

  const isNotificationChecked = () => {
    return notificationPermission !== PermissionStatusEnum.UNKNOWN;
  };

  /**
   * Helper method to determine the next step for permission requests.
   * In general there is a linear flow, but because Android does not
   * require permission for notifications, we skip the notifications
   * step on Android.
   *
   * @param {currentStep} StepEnum
   * @returns {StepEnum}
   */
  const getNextStep = currentStep => {
    switch (currentStep) {
      case StepEnum.LOCATION:
        return getLocationNextStep();
      case StepEnum.NOTIFICATIONS:
        return __DEV__ ? StepEnum.HCA_SUBSCRIPTION : StepEnum.DONE;
      case StepEnum.HCA_SUBSCRIPTION:
        return StepEnum.DONE;
    }
  };

  const checkLocationStatus = async () => {
    const nextStep = getNextStep(StepEnum.LOCATION);
    const setting = getLocationPermissionSetting();
    const status = await check(setting);

    switch (status) {
      case RESULTS.GRANTED:
        setCurrentStep(nextStep);
        setLocationPermission(PermissionStatusEnum.GRANTED);
        break;
      case RESULTS.BLOCKED:
        setCurrentStep(nextStep);
        setLocationPermission(PermissionStatusEnum.DENIED);
        break;
    }
  };

  const checkNotificationStatus = async () => {
    const nextStep = getNextStep(StepEnum.NOTIFICATIONS);
    const { status } = await checkNotifications();

    switch (status) {
      case RESULTS.GRANTED:
        setCurrentStep(nextStep);
        setNotificationPermission(PermissionStatusEnum.GRANTED);
        break;
      case RESULTS.BLOCKED:
        setCurrentStep(nextStep);
        setNotificationPermission(PermissionStatusEnum.DENIED);
        break;
    }
  };

  const checkSubsriptionStatus = async () => {
    const nextStep = getNextStep(StepEnum.HCA_SUBSCRIPTION);
    const hasUserSetSubscription = await HCAService.hasUserSetSubscription();

    // Only update state if the user has already set their subscription status
    if (hasUserSetSubscription) {
      const isEnabled = await HCAService.isAutosubscriptionEnabled();
      const authSubscriptionStatus = isEnabled
        ? PermissionStatusEnum.GRANTED
        : PermissionStatusEnum.DENIED;

      setCurrentStep(nextStep);
      setAuthSubscriptionStatus(authSubscriptionStatus);
    }
  };

  const getLocationNextStep = () => {
    if (isPlatformiOS()) {
      return StepEnum.NOTIFICATIONS;
    } else if (__DEV__) {
      return StepEnum.HCA_SUBSCRIPTION;
    } else {
      return isPlatformiOS() ? StepEnum.NOTIFICATIONS : StepEnum.DONE;
    }
  };

  /**
   * Gets the respective location permissions settings string
   * for the user's current device.
   *   */
  const getLocationPermissionSetting = () => {
    return isPlatformiOS()
      ? PERMISSIONS.IOS.LOCATION_ALWAYS
      : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
  };

  const requestLocation = async () => {
    const nextStep = getNextStep(StepEnum.LOCATION);
    const locationPermission = getLocationPermissionSetting();
    const status = await request(locationPermission);

    switch (status) {
      case RESULTS.GRANTED:
        setCurrentStep(nextStep);
        setLocationPermission(PermissionStatusEnum.GRANTED);
        break;
      case RESULTS.BLOCKED:
        setCurrentStep(nextStep);
        setLocationPermission(nextStep);
        break;
    }
  };

  const requestNotification = async () => {
    const nextStep = getNextStep(StepEnum.NOTIFICATIONS);
    const { status } = await requestNotifications(['alert', 'badge', 'sound']);

    switch (status) {
      case RESULTS.GRANTED:
        setCurrentStep(nextStep);
        setNotificationPermission(PermissionStatusEnum.GRANTED);
        break;
      case RESULTS.BLOCKED:
        setCurrentStep(nextStep);
        setNotificationPermission(PermissionStatusEnum.DENIED);
        break;
    }
  };

  const requestHCASubscription = async () => {
    const nextStep = getNextStep(StepEnum.HCA_SUBSCRIPTION);
    await HCAService.enableAutoSubscription();

    setCurrentStep(nextStep),
      setAuthSubscriptionStatus(PermissionStatusEnum.GRANTED);
  };

  /**
   * Allows the user to skip over a given step by setting the
   * permission for that step to `DENIED`
   * @returns {StepEnum}
   */
  const skipCurrentStep = () => {
    const status = PermissionStatusEnum.DENIED;
    const nextStep = getNextStep(currentStep);

    switch (currentStep) {
      case StepEnum.LOCATION:
        setCurrentStep(nextStep);
        setLocationPermission(status);
        break;
      case StepEnum.NOTIFICATIONS:
        setCurrentStep(nextStep);
        setNotificationPermission(status);
        break;
      case StepEnum.HCA_SUBSCRIPTION:
        setCurrentStep(nextStep);
        setAuthSubscriptionStatus(status);
        break;
    }
  };

  const buttonPressed = async () => {
    switch (currentStep) {
      case StepEnum.LOCATION:
        requestLocation();
        break;
      case StepEnum.NOTIFICATIONS:
        requestNotification();
        break;
      case StepEnum.HCA_SUBSCRIPTION:
        requestHCASubscription();
        break;
      case StepEnum.DONE:
        SetStoreData(
          PARTICIPATE,
          locationPermission === PermissionStatusEnum.GRANTED,
        );
        SetStoreData('ONBOARDING_DONE', true);
        navigation.replace('Main');
    }
  };

  const getTitleText = () => {
    switch (currentStep) {
      case StepEnum.LOCATION:
        return languages.t('label.launch_location_header');
      case StepEnum.NOTIFICATIONS:
        return languages.t('label.launch_notif_header');
      case StepEnum.HCA_SUBSCRIPTION:
        return languages.t('label.launch_authority_header');
      case StepEnum.DONE:
        return languages.t('label.launch_done_header');
    }
  };

  const getTitleTextView = () => {
    const use = currentStep === StepEnum.DONE ? 'headline1' : 'headline2';

    return (
      <Typography style={styles.headerText} use={use} testID='Header'>
        {getTitleText()}
      </Typography>
    );
  };

  const getSubtitleText = () => {
    let style, text;

    switch (currentStep) {
      case StepEnum.LOCATION:
        [style, text] = [
          styles.subheaderText,
          languages.t('label.launch_location_subheader'),
        ];
        break;
      case StepEnum.NOTIFICATIONS:
        [style, text] = [
          styles.subheaderText,
          languages.t('label.launch_notif_subheader'),
        ];
        break;
      case StepEnum.HCA_SUBSCRIPTION:
        [style, text] = [
          styles.subheaderTextWide,
          languages.t('label.launch_authority_subheader'),
        ];
        break;
      case StepEnum.DONE:
        [style, text] = [
          styles.subheaderText,
          languages.t('label.launch_done_subheader'),
        ];
        break;
    }

    return (
      <Typography style={style} use={'body3'}>
        {text}
      </Typography>
    );
  };

  const getLocationPermission = () => {
    return (
      <>
        <View style={styles.divider} />
        <PermissionDescription
          title={languages.t('label.launch_location_access')}
          status={locationPermission}
        />
        <View style={styles.divider} />
      </>
    );
  };

  const getNotificationsPermissionIfIOS = () => {
    return (
      isPlatformiOS() && (
        <>
          <PermissionDescription
            title={languages.t('label.launch_notification_access')}
            status={notificationPermission}
          />
          <View style={styles.divider} />
        </>
      )
    );
  };

  const getAuthSubscriptionStatus = () => {
    return (
      <>
        <PermissionDescription
          title={languages.t('label.launch_authority_access')}
          status={authSubscriptionStatus}
        />
        <View style={styles.divider} />
      </>
    );
  };

  const getButtonText = () => {
    switch (currentStep) {
      case StepEnum.LOCATION:
        return languages.t('label.launch_enable_location');
      case StepEnum.NOTIFICATIONS:
        return languages.t('label.launch_enable_notif');
      case StepEnum.HCA_SUBSCRIPTION:
        return languages.t('label.launch_enable_auto_subscription');
      case StepEnum.DONE:
        return languages.t('label.launch_finish_set_up');
    }
  };

  const getSkipStepButton = () => {
    if (currentStep !== StepEnum.DONE) {
      return (
        <TouchableOpacity onPress={skipCurrentStep}>
          <Typography style={styles.skipThisStepBtn} use={'body1'}>
            {languages.t('label.skip_this_step')}
          </Typography>
        </TouchableOpacity>
      );
    }
  };

  const LocationPermissionQuestions = () => {
    return (
      <>
        {getLocationPermission()}
        {getNotificationsPermissionIfIOS()}
        {__DEV__ && getAuthSubscriptionStatus()}
        <View style={styles.spacer} />
      </>
    );
  };

  const BluetoothPermissionQuestions = () => {
    return (
      <PermissionDescription
        title={'Ask for bluetooth permission here'}
        status={PermissionStatusEnum.UNKNOWN}
      />
    );
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

        <View style={styles.mainContainer}>
          <View style={styles.contentContainer}>
            {getTitleTextView()}
            {getSubtitleText()}
            {getSkipStepButton()}
            <View style={styles.statusContainer}>
              {tracingStrategy === 'gps' ? (
                <LocationPermissionQuestions />
              ) : (
                <BluetoothPermissionQuestions />
              )}
            </View>
          </View>
        </View>
        <View style={sharedStyles.footerContainer}>
          <Button label={getButtonText()} onPress={buttonPressed} />
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
  subheaderTextWide: {
    color: Colors.WHITE,
    marginTop: '3%',
    width: width * 0.8,
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

export default Onboarding;
