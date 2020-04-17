import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import React, { Component } from 'react';
import {
  AppState,
  BackHandler,
  Dimensions,
  Image,
  ImageBackground,
  Linking,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  PERMISSIONS,
  RESULTS,
  check,
  openSettings,
} from 'react-native-permissions';
import Pulse from 'react-native-pulse';
import { SvgXml } from 'react-native-svg';

import BackgroundImageAtRisk from './../assets/images/backgroundAtRisk.png';
import exportImage from './../assets/images/export.png';
import foreArrow from './../assets/images/foreArrow.png';
import BackgroundImage from './../assets/images/launchScreenBackground.png';
import SettingsGear from './../assets/svgs/settingsGear';
import StateAtRisk from './../assets/svgs/stateAtRisk';
import StateNoContact from './../assets/svgs/stateNoContact';
import StateUnknown from './../assets/svgs/stateUnknown';
import { isPlatformAndroid, isPlatformiOS } from './../Util';
import ButtonWrapper from '../components/ButtonWrapper';
import Colors from '../constants/colors';
import fontFamily from '../constants/fonts';
import { PARTICIPATE } from '../constants/storage';
import { GetStoreData, SetStoreData } from '../helpers/General';
import { checkIntersect } from '../helpers/Intersect';
import languages from '../locales/languages';
import BackgroundTaskServices from '../services/BackgroundTaskService';
import LocationServices from '../services/LocationService';

const MAYO_COVID_URL = 'https://www.mayoclinic.org/coronavirus-covid-19';

const StateEnum = {
  UNKNOWN: 0,
  AT_RISK: 1,
  NO_CONTACT: 2,
  SETTING_OFF: 3,
};

const StateIcon = ({ status, size }) => {
  let icon;
  switch (status) {
    case StateEnum.UNKNOWN:
      icon = StateUnknown;
      break;
    case StateEnum.AT_RISK:
      icon = StateAtRisk;
      break;
    case StateEnum.NO_CONTACT:
      icon = StateNoContact;
      break;
    case StateEnum.SETTING_OFF:
      icon = StateUnknown;
      break;
  }
  return (
    <SvgXml xml={icon} width={size ? size : 80} height={size ? size : 80} />
  );
};

const height = Dimensions.get('window').height;

class LocationTracking extends Component {
  constructor(props) {
    super(props);

    if (isPlatformAndroid()) {
      StatusBar.setBackgroundColor(Colors.TRANSPARENT);
      StatusBar.setBarStyle('light-content');
      StatusBar.setTranslucent(true);
    }

    this.state = {
      appState: AppState.currentState,
      timer_intersect: null,
      isLogging: '',
      currentState: StateEnum.NO_CONTACT,
    };
    try {
      this.checkCurrentState();
    } catch (e) {
      // statements
      console.log(e);
    }
  }

  /*  Check current state
        1) determine if user has correct location permissions
        2) check if they are at risk -> checkIfUserAtRisk()
        3) set state accordingly */
  checkCurrentState() {
    // NEED TO TEST ON ANDROID
    let locationPermission;
    if (isPlatformiOS()) {
      locationPermission = PERMISSIONS.IOS.LOCATION_ALWAYS;
    } else {
      locationPermission = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
    }

    // If user has location enabled & permissions, start logging
    GetStoreData(PARTICIPATE, false).then(isParticipating => {
      if (isParticipating) {
        check(locationPermission)
          .then(result => {
            switch (result) {
              case RESULTS.GRANTED:
                LocationServices.start();
                this.checkIfUserAtRisk();
                return;
              case RESULTS.UNAVAILABLE:
              case RESULTS.BLOCKED:
                console.log('NO LOCATION');
                LocationServices.stop();
                this.setState({ currentState: StateEnum.UNKNOWN });
            }
          })
          .catch(error => {
            console.log('error checking location: ' + error);
          });
      } else {
        this.setState({ currentState: StateEnum.SETTING_OFF });
        LocationServices.stop();
      }
    });
  }

  checkIfUserAtRisk() {
    BackgroundTaskServices.start();
    // already set on 12h timer, but run when this screen opens too
    checkIntersect();

    GetStoreData('CROSSED_PATHS').then(dayBin => {
      dayBin = JSON.parse(dayBin);
      if (dayBin !== null && dayBin.reduce((a, b) => a + b, 0) > 0) {
        console.log('Found crossed paths');
        this.setState({ currentState: StateEnum.AT_RISK });
      } else {
        console.log("Can't find crossed paths");
        this.setState({ currentState: StateEnum.NO_CONTACT });
      }
    });

    // If the user has location tracking disabled, set enum to match
    GetStoreData(PARTICIPATE, false).then(isParticipating => {
      if (isParticipating === false) {
        this.setState({
          currentState: StateEnum.SETTING_OFF,
        });
      }
    });
  }

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    // refresh state if settings have changed
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkIfUserAtRisk();
    });
    GetStoreData(PARTICIPATE, false)
      .then(isParticipating => {
        if (isParticipating === 'true') {
          this.setState({
            isLogging: true,
          });
          this.willParticipate();
        } else {
          this.setState({
            isLogging: false,
            currentState: StateEnum.SETTING_OFF,
          });
        }
      })
      .catch(error => console.log(error));
  }

  findNewAuthorities() {
    // TODO: This should pull down the Healtcare Authorities list (see Settings.js)
    // Then it should look at the GPS extent box of each authority and (if any
    // of the GPS coordinates change) pop-up a notification that is basically:
    //    There is a new "Healthcare Authority" for an area where you have
    //    been.
    // Tapping that notification asks if they want to Add that Healthcare Authority
    // under the Settings screen.
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
    clearInterval(this.state.timer_intersect);
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    this.unsubscribe();
  }

  // need to check state again if new foreground event
  // e.g. if user changed location permission
  handleAppStateChange = nextAppState => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      this.checkCurrentState();
    }
    this.setState({ appState: nextAppState });
  };

  handleBackPress = () => {
    BackHandler.exitApp(); // works best when the goBack is async
    return true;
  };

  export() {
    this.props.navigation.navigate('ExportScreen', {});
  }

  import() {
    this.props.navigation.navigate('ImportScreen', {});
  }

  willParticipate = () => {
    SetStoreData(PARTICIPATE, 'true').then(() => {
      // Turn of bluetooth for v1
      //BroadcastingServices.start();
    });
    // Check and see if they actually authorized in the system dialog.
    // If not, stop services and set the state to !isLogging
    // Fixes tripleblindmarket/private-kit#129
    BackgroundGeolocation.checkStatus(({ authorization }) => {
      if (authorization === BackgroundGeolocation.AUTHORIZED) {
        LocationServices.start();
        this.setState({
          isLogging: true,
        });
      } else if (authorization === BackgroundGeolocation.NOT_AUTHORIZED) {
        LocationServices.stop();
        // Turn off bluetooth for v1
        //BroadcastingServices.stop(this.props.navigation);
        BackgroundTaskServices.stop();
        this.setState({
          isLogging: false,
        });
      }
    });
  };

  news() {
    this.props.navigation.navigate('NewsScreen', {});
  }

  licenses() {
    this.props.navigation.navigate('LicensesScreen', {});
  }

  settings() {
    this.props.navigation.navigate('SettingsScreen', {});
  }

  notifications() {
    this.props.navigation.navigate('NotificationScreen', {});
  }

  setOptOut = () => {
    LocationServices.stop(this.props.navigation);
    // Turn of bluetooth for v1
    //BroadcastingServices.stop(this.props.navigation);
    this.setState({
      isLogging: false,
    });
  };

  getBackground() {
    if (this.state.currentState === StateEnum.AT_RISK) {
      return BackgroundImageAtRisk;
    }
    return BackgroundImage;
  }

  getSettings() {
    return (
      <TouchableOpacity
        style={styles.settingsContainer}
        onPress={() => {
          this.props.navigation.navigate('SettingsScreen');
        }}>
        {/* Is there is a reason there's this imageless image tag here? Can we delete it? */}
        <Image resizeMode={'contain'} />
        <SvgXml
          style={styles.stateIcon}
          xml={SettingsGear}
          width={32}
          height={32}
        />
      </TouchableOpacity>
    );
  }

  getPulseIfNeeded() {
    if (this.state.currentState == StateEnum.NO_CONTACT) {
      return (
        <View style={styles.pulseContainer}>
          <Pulse
            image={{ exportImage }}
            color={Colors.PULSE_WHITE}
            numPulses={3}
            diameter={400}
            speed={20}
            duration={2000}
          />
          <StateIcon size={height} status={this.state.currentState} />
        </View>
      );
    }
    return (
      <View style={styles.pulseContainer}>
        <Text>Testdsfafasfsdafasfsadf</Text>
        <StateIcon size={height} status={this.state.currentState} />
      </View>
    );
  }

  getMainText() {
    switch (this.state.currentState) {
      case StateEnum.NO_CONTACT:
        return (
          <Text style={styles.mainTextBelow}>
            {languages.t('label.home_no_contact_header')}
          </Text>
        );
      case StateEnum.AT_RISK:
        return (
          <Text style={styles.mainTextAbove}>
            {languages.t('label.home_at_risk_header')}
          </Text>
        );
      case StateEnum.UNKNOWN:
        return (
          <Text style={styles.mainTextBelow}>
            {languages.t('label.home_unknown_header')}
          </Text>
        );
      case StateEnum.SETTING_OFF:
        return (
          <Text style={styles.mainTextBelow}>
            {languages.t('label.home_setting_off_header')}
          </Text>
        );
    }
  }

  getSubText() {
    switch (this.state.currentState) {
      case StateEnum.NO_CONTACT:
        return languages.t('label.home_no_contact_subtext');
      case StateEnum.AT_RISK:
        return languages.t('label.home_at_risk_subtext');
      case StateEnum.UNKNOWN:
        return languages.t('label.home_unknown_subtext');
      case StateEnum.SETTING_OFF:
        return languages.t('label.home_setting_off_subtext');
    }
  }
  getSubSubText() {
    switch (this.state.currentState) {
      case StateEnum.NO_CONTACT:
        return null;
      case StateEnum.AT_RISK:
        return languages.t('label.home_at_risk_subsubtext');
      case StateEnum.UNKNOWN:
        return null;
      case StateEnum.SETTING_OFF:
        return null;
    }
  }

  getCTAIfNeeded() {
    let buttonLabel;
    let buttonFunction;
    if (this.state.currentState === StateEnum.NO_CONTACT) {
      return;
    } else if (this.state.currentState === StateEnum.AT_RISK) {
      buttonLabel = languages.t('label.see_exposure_history');
      buttonFunction = () => {
        this.props.navigation.navigate('ExposureHistoryScreen');
      };
    } else if (this.state.currentState === StateEnum.UNKNOWN) {
      buttonLabel = languages.t('label.home_enable_location');
      buttonFunction = () => {
        openSettings();
      };
    } else if (this.state.currentState === StateEnum.SETTING_OFF) {
      buttonLabel = languages.t('label.home_enable_location');
      buttonFunction = () => {
        this.settings();
      };
    }
    return (
      <View style={styles.buttonContainer}>
        <ButtonWrapper
          title={buttonLabel}
          onPress={() => {
            buttonFunction();
          }}
          buttonColor={Colors.BLUE_BUTTON}
          bgColor={Colors.WHITE}
        />
      </View>
    );
  }

  getMayoInfoPressed() {
    Linking.openURL(MAYO_COVID_URL);
  }

  render() {
    return (
      <ImageBackground
        source={this.getBackground()}
        style={styles.backgroundImage}>
        <StatusBar
          barStyle='light-content'
          backgroundColor='transparent'
          translucent
        />
        {this.getPulseIfNeeded()}

        <View style={styles.mainContainer}>
          <View style={styles.contentAbovePulse}>
            {this.state.currentState === StateEnum.AT_RISK &&
              this.getMainText()}
            <Text style={styles.subsubheaderText}>{this.getSubSubText()}</Text>
          </View>
          <View style={styles.contentBelowPulse}>
            {this.state.currentState !== StateEnum.AT_RISK &&
              this.getMainText()}
            <Text style={styles.subheaderText}>{this.getSubText()}</Text>
            {this.getCTAIfNeeded()}
          </View>
        </View>

        <View>
          <TouchableOpacity
            onPress={this.getMayoInfoPressed.bind(this)}
            style={styles.mayoInfoRow}>
            <View style={styles.mayoInfoContainer}>
              <Text
                style={styles.mainMayoHeader}
                onPress={() => Linking.openURL(MAYO_COVID_URL)}>
                {languages.t('label.home_mayo_link_heading')}
              </Text>
              <Text
                style={styles.mainMayoSubtext}
                onPress={() => Linking.openURL(MAYO_COVID_URL)}>
                {languages.t('label.home_mayo_link_label')}
              </Text>
            </View>
            <View style={styles.arrowContainer}>
              <Image source={foreArrow} style={this.arrow} />
            </View>
          </TouchableOpacity>
        </View>
        {this.getSettings()}
      </ImageBackground>
    );
  }
}

const PULSE_GAP = 80;

const styles = StyleSheet.create({
  backgroundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    flex: 1,
    justifyContent: 'flex-end',
  },
  mainContainer: {
    position: 'absolute',
    // resizeMode: 'contain',
    // aligns the center of the main container with center of pulse
    // so that two `flex: 1` views will be have a reasonable chance at natural
    // flex flow for above and below the pulse.
    top: '-10%',
    left: 0,
    right: 0,
    height: '100%',
    paddingHorizontal: '12%',
    paddingBottom: 12,
  },
  contentAbovePulse: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: PULSE_GAP / 2,
  },
  contentBelowPulse: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: PULSE_GAP,
  },
  settingsContainer: {
    position: 'absolute',
    top: 0,
    marginTop: '14%',
    marginRight: '5%',
    alignSelf: 'flex-end',
  },
  buttonContainer: {
    top: 24,
  },
  pulseContainer: {
    position: 'absolute',
    resizeMode: 'contain',
    height: '100%',
    top: '-13%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  mainTextAbove: {
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: 24,
    color: Colors.WHITE,
    fontSize: 28,
    fontFamily: fontFamily.primaryMedium,
  },
  mainTextBelow: {
    textAlign: 'center',
    lineHeight: 34,
    color: Colors.WHITE,
    fontSize: 26,
    fontFamily: fontFamily.primaryMedium,
    marginBottom: 24,
  },
  subheaderText: {
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 24.5,
    color: Colors.WHITE,
    fontSize: 18,
    fontFamily: fontFamily.primaryRegular,
  },
  subsubheaderText: {
    textAlign: 'center',
    lineHeight: 24.5,
    color: Colors.WHITE,
    fontSize: 16,
    fontFamily: fontFamily.primaryLight,
    marginBottom: 24,
  },
  mayoInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mayoInfoContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignContent: 'flex-end',
    padding: 20,
  },
  mainMayoHeader: {
    textAlign: 'left',
    color: Colors.MISCHKA,
    fontSize: 18,
    fontFamily: fontFamily.primaryBold,
  },
  mainMayoSubtext: {
    textAlign: 'left',
    color: Colors.MISCHKA,
    fontSize: 18,
    fontFamily: fontFamily.primaryRegular,
  },
  arrowContainer: {
    alignSelf: 'center',
    paddingRight: 20,
  },
});

export default LocationTracking;
