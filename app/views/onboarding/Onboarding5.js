import React, { Component } from 'react';
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

import BackgroundImage from './../../assets/images/launchScreenBackground.png';
import { isPlatformiOS } from './../../Util';
import IconDenied from '../../assets/svgs/permissionDenied';
import IconGranted from '../../assets/svgs/permissionGranted';
import IconUnknown from '../../assets/svgs/permissionUnknown';
import { Button } from '../../components/Button';
import { Typography } from '../../components/Typography';
import Colors from '../../constants/colors';
import { PARTICIPATE } from '../../constants/storage';
import { Theme } from '../../constants/themes';
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
      icon = IconUnknown;
      break;
    case PermissionStatusEnum.GRANTED:
      icon = IconGranted;
      break;
    case PermissionStatusEnum.DENIED:
      icon = IconDenied;
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

class Onboarding extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentStep: StepEnum.LOCATION,
      notificationPermission: PermissionStatusEnum.UNKNOWN,
      locationPermission: PermissionStatusEnum.UNKNOWN,
      authSubscriptionStatus: PermissionStatusEnum.UNKNOWN,
    };
  }

  componentDidMount() {
    this.checkLocationStatus();
    isPlatformiOS() && this.checkNotificationStatus();
    __DEV__ && this.checkSubsriptionStatus();
  }

  isLocationChecked() {
    return this.state.locationPermission !== PermissionStatusEnum.UNKNOWN;
  }

  isNotificationChecked() {
    return this.state.notificationPermission !== PermissionStatusEnum.UNKNOWN;
  }

  /**
   * Helper method to determine the next step for permission requests.
   * In general there is a linear flow, but because Android does not
   * require permission for notifications, we skip the notifications
   * step on Android.
   *
   * @param {currentStep} StepEnum
   * @returns {StepEnum}
   */
  getNextStep(currentStep) {
    switch (currentStep) {
      case StepEnum.LOCATION:
        return this.getLocationNextStep();
      case StepEnum.NOTIFICATIONS:
        return __DEV__ ? StepEnum.HCA_SUBSCRIPTION : StepEnum.DONE;
      case StepEnum.HCA_SUBSCRIPTION:
        return StepEnum.DONE;
    }
  }

  async checkLocationStatus() {
    const nextStep = this.getNextStep(StepEnum.LOCATION);
    const setting = this.getLocationPermissionSetting();
    const status = await check(setting);

    switch (status) {
      case RESULTS.GRANTED:
        this.setState({
          currentStep: nextStep,
          locationPermission: PermissionStatusEnum.GRANTED,
        });
        break;
      case RESULTS.BLOCKED:
        this.setState({
          currentStep: nextStep,
          locationPermission: PermissionStatusEnum.DENIED,
        });
        break;
    }
  }

  async checkNotificationStatus() {
    const nextStep = this.getNextStep(StepEnum.NOTIFICATIONS);
    const { status } = await checkNotifications();

    switch (status) {
      case RESULTS.GRANTED:
        this.setState({
          currentStep: nextStep,
          notificationPermission: PermissionStatusEnum.GRANTED,
        });
        break;
      case RESULTS.BLOCKED:
        this.setState({
          currentStep: nextStep,
          notificationPermission: PermissionStatusEnum.DENIED,
        });
        break;
    }
  }

  async checkSubsriptionStatus() {
    const nextStep = this.getNextStep(StepEnum.HCA_SUBSCRIPTION);
    const hasUserSetSubscription = await HCAService.hasUserSetSubscription();

    // Only update state if the user has already set their subscription status
    if (hasUserSetSubscription) {
      const isEnabled = await HCAService.isAutosubscriptionEnabled();
      const authSubscriptionStatus = isEnabled
        ? PermissionStatusEnum.GRANTED
        : PermissionStatusEnum.DENIED;

      this.setState({
        currentStep: nextStep,
        authSubscriptionStatus,
      });
    }
  }

  getLocationNextStep() {
    if (isPlatformiOS()) {
      return StepEnum.NOTIFICATIONS;
    } else if (__DEV__) {
      return StepEnum.HCA_SUBSCRIPTION;
    } else {
      return isPlatformiOS() ? StepEnum.NOTIFICATIONS : StepEnum.DONE;
    }
  }

  /**
   * Gets the respective location permissions settings string
   * for the user's current device.
   *   */
  getLocationPermissionSetting() {
    return isPlatformiOS()
      ? PERMISSIONS.IOS.LOCATION_ALWAYS
      : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
  }

  async requestLocation() {
    const nextStep = this.getNextStep(StepEnum.LOCATION);
    const locationPermission = this.getLocationPermissionSetting();
    const status = await request(locationPermission);

    switch (status) {
      case RESULTS.GRANTED:
        this.setState({
          currentStep: nextStep,
          locationPermission: PermissionStatusEnum.GRANTED,
        });
        break;
      case RESULTS.BLOCKED:
        this.setState({
          currentStep: nextStep,
          locationPermission: PermissionStatusEnum.DENIED,
        });
        break;
    }
  }

  async requestNotification() {
    const nextStep = this.getNextStep(StepEnum.NOTIFICATIONS);
    const { status } = await requestNotifications(['alert', 'badge', 'sound']);

    switch (status) {
      case RESULTS.GRANTED:
        this.setState({
          currentStep: nextStep,
          notificationPermission: PermissionStatusEnum.GRANTED,
        });
        break;
      case RESULTS.BLOCKED:
        this.setState({
          currentStep: nextStep,
          notificationPermission: PermissionStatusEnum.DENIED,
        });
        break;
    }
  }

  async requestHCASubscription() {
    const nextStep = this.getNextStep(StepEnum.HCA_SUBSCRIPTION);
    await HCAService.enableAutoSubscription();

    this.setState({
      currentStep: nextStep,
      authSubscriptionStatus: PermissionStatusEnum.GRANTED,
    });
  }

  /**
   * Allows the user to skip over a given step by setting the
   * permission for that step to `DENIED`
   * @returns {StepEnum}
   */
  skipCurrentStep() {
    const status = PermissionStatusEnum.DENIED;
    const nextStep = this.getNextStep(this.state.currentStep);

    switch (this.state.currentStep) {
      case StepEnum.LOCATION:
        this.setState({
          currentStep: nextStep,
          locationPermission: status,
        });
        break;
      case StepEnum.NOTIFICATIONS:
        this.setState({
          currentStep: nextStep,
          notificationPermission: status,
        });
        break;
      case StepEnum.HCA_SUBSCRIPTION:
        this.setState({
          currentStep: nextStep,
          authSubscriptionStatus: status,
        });
        break;
    }
  }

  async buttonPressed() {
    switch (this.state.currentStep) {
      case StepEnum.LOCATION:
        this.requestLocation();
        break;
      case StepEnum.NOTIFICATIONS:
        this.requestNotification();
        break;
      case StepEnum.HCA_SUBSCRIPTION:
        this.requestHCASubscription();
        break;
      case StepEnum.DONE:
        SetStoreData(
          PARTICIPATE,
          this.state.locationPermission === PermissionStatusEnum.GRANTED,
        );
        SetStoreData('ONBOARDING_DONE', true);
        this.props.navigation.replace('Main');
    }
  }

  getTitleText() {
    switch (this.state.currentStep) {
      case StepEnum.LOCATION:
        return languages.t('label.launch_location_header');
      case StepEnum.NOTIFICATIONS:
        return languages.t('label.launch_notif_header');
      case StepEnum.HCA_SUBSCRIPTION:
        return languages.t('label.launch_authority_header');
      case StepEnum.DONE:
        return languages.t('label.launch_done_header');
    }
  }

  getTitleTextView() {
    const use =
      this.state.currentStep === StepEnum.DONE ? 'headline1' : 'headline2';

    return (
      <Typography style={styles.headerText} use={use} testID='Header'>
        {this.getTitleText()}
      </Typography>
    );
  }

  getSubtitleText() {
    let style, text;

    switch (this.state.currentStep) {
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
  }

  getLocationPermission() {
    return (
      <>
        <View style={styles.divider} />
        <PermissionDescription
          title={languages.t('label.launch_location_access')}
          status={this.state.locationPermission}
        />
        <View style={styles.divider} />
      </>
    );
  }

  getNotificationsPermissionIfIOS() {
    return (
      isPlatformiOS() && (
        <>
          <PermissionDescription
            title={languages.t('label.launch_notification_access')}
            status={this.state.notificationPermission}
          />
          <View style={styles.divider} />
        </>
      )
    );
  }

  getAuthSubscriptionStatus() {
    return (
      <>
        <PermissionDescription
          title={languages.t('label.launch_authority_access')}
          status={this.state.authSubscriptionStatus}
        />
        <View style={styles.divider} />
      </>
    );
  }

  getButtonText() {
    switch (this.state.currentStep) {
      case StepEnum.LOCATION:
        return languages.t('label.launch_enable_location');
      case StepEnum.NOTIFICATIONS:
        return languages.t('label.launch_enable_notif');
      case StepEnum.HCA_SUBSCRIPTION:
        return languages.t('label.launch_enable_auto_subscription');
      case StepEnum.DONE:
        return languages.t('label.launch_finish_set_up');
    }
  }

  getSkipStepButton() {
    if (this.state.currentStep !== StepEnum.DONE) {
      return (
        <TouchableOpacity onPress={this.skipCurrentStep.bind(this)}>
          <Typography style={styles.skipThisStepBtn} use={'body1'}>
            {languages.t('label.skip_this_step')}
          </Typography>
        </TouchableOpacity>
      );
    }
  }

  render() {
    return (
      <Theme use='violet'>
        <ImageBackground
          source={BackgroundImage}
          style={styles.backgroundImage}>
          <StatusBar
            barStyle='light-content'
            backgroundColor='transparent'
            translucent
          />

          <View style={styles.mainContainer}>
            <View style={styles.contentContainer}>
              {this.getTitleTextView()}
              {this.getSubtitleText()}
              {this.getSkipStepButton()}
              <View style={styles.statusContainer}>
                {this.getLocationPermission()}
                {this.getNotificationsPermissionIfIOS()}
                {__DEV__ && this.getAuthSubscriptionStatus()}
                <View style={styles.spacer} />
              </View>
            </View>
          </View>
          <View style={sharedStyles.footerContainer}>
            <Button
              label={this.getButtonText()}
              onPress={this.buttonPressed.bind(this)}
            />
          </View>
        </ImageBackground>
      </Theme>
    );
  }
}

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
