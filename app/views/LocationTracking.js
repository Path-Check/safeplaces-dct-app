import React, { Component } from 'react';
import {
  AppState,
  SafeAreaView,
  StyleSheet,
  Linking,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
  BackHandler,
  ImageBackground,
  StatusBar,
} from 'react-native';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import BackgroundImage from './../assets/images/launchScreenBackground.png';
import BackgroundImageAtRisk from './../assets/images/backgroundAtRisk.png';
import Colors from '../constants/colors';
import LocationServices from '../services/LocationService';
//import BroadcastingServices from '../services/BroadcastingService';
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import PushNotification from 'react-native-push-notification';
import exportImage from './../assets/images/export.png';
import ButtonWrapper from '../components/ButtonWrapper';
import { isPlatformiOS } from './../Util';
import Pulse from 'react-native-pulse';
import {
  check,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';
import foreArrow from './../assets/images/foreArrow.png';

import { IntersectSet } from '../helpers/Intersect';
import { GetStoreData, SetStoreData } from '../helpers/General';
import languages from '../locales/languages';

import { SvgXml } from 'react-native-svg';
import StateAtRisk from './../assets/svgs/stateAtRisk';
import StateNoContact from './../assets/svgs/stateNoContact';
import StateUnknown from './../assets/svgs/stateUnknown';
import SettingsGear from './../assets/svgs/settingsGear';
import fontFamily from '../constants/fonts';

const StateEnum = {
  UNKNOWN: 0,
  AT_RISK: 1,
  NO_CONTACT: 2,
};

const StateIcon = ({ title, status, size, ...props }) => {
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
  }
  return (
    <SvgXml xml={icon} width={size ? size : 80} height={size ? size : 80} />
  );
};

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

class LocationTracking extends Component {
  constructor(props) {
    super(props);

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
    let locationDisabled = true;
    check(locationPermission)
      .then(result => {
        switch (result) {
          case RESULTS.GRANTED:
            this.checkIfUserAtRisk();
            return;
          case RESULTS.UNAVAILABLE:
          case RESULTS.BLOCKED:
            console.log('NO LOCATION');
            this.setState({ currentState: StateEnum.UNKNOWN });
        }
      })
      .catch(error => {
        console.log('error checking location: ' + error);
      });
  }

  checkIfUserAtRisk() {
    // already set on 12h timer, but run when this screen opens too
    this.intersect_tick();

    GetStoreData('CROSSED_PATHS').then(dayBin => {
      if (dayBin === null) {
        console.log("Can't find crossed paths");
        this.setState({ currentState: StateEnum.NO_CONTACT });
      } else {
        console.log('Found crossed paths');
        this.setState({ currentState: StateEnum.AT_RISK });
        // dayBinParsed = JSON.parse(dayBin);
      }
    });
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    GetStoreData('PARTICIPATE')
      .then(isParticipating => {
        if (isParticipating === 'true') {
          this.setState({
            isLogging: true,
          });
          this.willParticipate();
        } else {
          this.setState({
            isLogging: false,
          });
        }
      })
      .catch(error => console.log(error));

    let timer_intersect = setInterval(this.intersect_tick, 1000 * 60 * 60 * 12); // once every 12 hours
    // DEBUG:  1000 * 10); // once every 10 seconds

    this.setState({
      timer_intersect,
    });
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

  intersect_tick = () => {
    // This function is called once every 12 hours.  It should do several things:

    this.findNewAuthorities();

    // Get the user's health authorities
    GetStoreData('HEALTH_AUTHORITIES')
      .then(authority_list => {
        if (!authority_list) {
          // DEBUG: Force a test list
          // authority_list = [
          //  {
          //    name: 'Platte County Health',
          //    url:
          //      'https://raw.githack.com/tripleblindmarket/safe-places/develop/examples/safe-paths.json',
          //  },
          //];
          return;
        }

        let name_news = [];

        if (authority_list) {
          // Pull down data from all the registered health authorities
          for (let authority of authority_list) {
            fetch(authority.url)
              .then(response => response.json())
              .then(responseJson => {
                // Example response =
                // { "authority_name":  "Steve's Fake Testing Organization",
                //   "publish_date_utc": "1584924583",
                //   "info_website": "https://www.who.int/emergencies/diseases/novel-coronavirus-2019",
                //   "concern_points":
                //    [
                //      { "time": 123, "latitude": 12.34, "longitude": 12.34},
                //      { "time": 456, "latitude": 12.34, "longitude": 12.34}
                //    ]
                // }

                // Update cache of info about the authority
                // TODO: Add an "info_newsflash" UTC timestamp and popup a
                //       notification if that changes, i.e. if there is a newsflash?
                name_news.push({
                  name: responseJson.authority_name,
                  news_url: responseJson.info_website,
                });

                // TODO: Look at "publish_date_utc".  We should notify users if
                //       their authority is no longer functioning.)

                IntersectSet(responseJson.concern_points, dayBin => {
                  if (dayBin !== null) {
                    PushNotification.localNotification({
                      title: languages.t('label.push_at_risk_title'),
                      message: languages.t('label.push_at_risk_message'),
                    });
                  }
                });
              });

            SetStoreData('AUTHORITY_NEWS', name_news)
              .then(() => {
                // TODO: Anything after this saves?  Background caching of
                //       news to make it snappy?  Could be a problem in some
                //       locales with high data costs.
              })
              .catch(error =>
                console.log('Failed to save authority/news URL list'),
              );
          }
        } else {
          console.log('No authority list');
          return;
        }
      })
      .catch(error => console.log('Failed to load authority list', error));
  };

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
    clearInterval(this.state.timer_intersect);
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  // need to check state again if new foreground event
  // e.g. if user changed location permission
  _handleAppStateChange = nextAppState => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      console.log('checkIfLocationDisabled');
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

  overlap() {
    this.props.navigation.navigate('OverlapScreen', {});
  }

  willParticipate = () => {
    SetStoreData('PARTICIPATE', 'true').then(() => {
      LocationServices.start();
      // Turn of bluetooth for v1
      //BroadcastingServices.start();
    });

    // Check and see if they actually authorized in the system dialog.
    // If not, stop services and set the state to !isLogging
    // Fixes tripleblindmarket/private-kit#129
    BackgroundGeolocation.checkStatus(({ authorization }) => {
      if (authorization === BackgroundGeolocation.AUTHORIZED) {
        this.setState({
          isLogging: true,
        });
      } else if (authorization === BackgroundGeolocation.NOT_AUTHORIZED) {
        LocationServices.stop(this.props.navigation);
        // Turn of bluetooth for v1
        //BroadcastingServices.stop(this.props.navigation);
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
          // THIS IS FOR TESTING - DELETE LATER
          // switch (this.state.currentState) {
          //   case StateEnum.NO_CONTACT:
          //     this.setState({ isLogging: '', currentState: StateEnum.AT_RISK });
          //     break;
          //   case StateEnum.AT_RISK:
          //     this.setState({ isLogging: '', currentState: StateEnum.UNKNOWN });
          //     break;
          //   case StateEnum.UNKNOWN:
          //     this.setState({
          //       isLogging: '',
          //       currentState: StateEnum.NO_CONTACT,
          //     });
          //     break;
          // }
        }}>
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
    }
  }

  getSubText() {
    switch (this.state.currentState) {
      case StateEnum.NO_CONTACT:
        return 'label.home_no_contact_subtext';
      case StateEnum.AT_RISK:
        return 'label.home_at_risk_subtext';
      case StateEnum.UNKNOWN:
        return 'label.home_unknown_subtext';
    }
  }
  getSubSubText() {
    switch (this.state.currentState) {
      case StateEnum.NO_CONTACT:
        return null;
      case StateEnum.AT_RISK:
        return 'label.home_at_risk_subsubtext';
      case StateEnum.UNKNOWN:
        return null;
    }
  }

  getCTAIfNeeded() {
    let buttonLabel;
    let buttonFunction;
    if (this.state.currentState === StateEnum.NO_CONTACT) {
      // TMP HACK FOR MI
      // buttonLabel = 'label.home_MASSIVE_HACK';
      // buttonFunction = () => {
      //   this.props.navigation.navigate('MapLocation');
      // };
      return;
    } else if (this.state.currentState === StateEnum.AT_RISK) {
      buttonLabel = 'label.home_next_steps';
      buttonFunction = () => {
        this.props.navigation.navigate('NotificationScreen');
      };
    } else if (this.state.currentState === StateEnum.UNKNOWN) {
      buttonLabel = 'label.home_enable_location';
      buttonFunction = () => {
        openSettings();
      };
    }
    return (
      <View style={styles.buttonContainer}>
        <ButtonWrapper
          title={languages.t(buttonLabel)}
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
    Linking.openURL(languages.t('label.home_mayo_link_URL'));
  }

  render() {
    return (
      <ImageBackground
        source={this.getBackground()}
        style={styles.backgroundImage}>
        <StatusBar
          barStyle='light-content'
          backgroundColor='transparent'
          translucent={true}
        />
        {this.getPulseIfNeeded()}
        <View style={styles.mainContainer}>
          <View style={styles.contentContainer}>
            {this.getMainText()}
            <Text style={styles.subheaderText}>
              {languages.t(this.getSubText())}
            </Text>
            <Text style={styles.subsubheaderText}>
              {languages.t(this.getSubSubText())}
            </Text>
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
                onPress={() =>
                  Linking.openURL(languages.t('label.home_mayo_link_URL'))
                }>
                {languages.t('label.home_mayo_link_heading')}
              </Text>
              <Text
                style={styles.mainMayoSubtext}
                onPress={() =>
                  Linking.openURL(languages.t('label.home_mayo_link_URL'))
                }>
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

const styles = StyleSheet.create({
  backgroundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    flex: 1,
  },
  mainContainer: {
    top: '50%',
    flex: 1,
  },
  contentContainer: {
    width: width * 0.8,
    flex: 1,
    alignSelf: 'center',
  },
  settingsContainer: {
    position: 'absolute',
    top: 0,
    marginTop: '14%',
    marginRight: '5%',
    alignSelf: 'flex-end',
  },
  buttonContainer: {
    top: '4%',
  },
  pulseContainer: {
    position: 'absolute',
    resizeMode: 'contain',
    top: '-13%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  mainTextAbove: {
    textAlign: 'center',
    lineHeight: 34,
    marginTop: -170,
    marginBottom: 125,
    color: Colors.WHITE,
    fontSize: 26,
    fontFamily: fontFamily.primaryMedium,
  },
  mainTextBelow: {
    textAlign: 'center',
    lineHeight: 34,
    color: Colors.WHITE,
    fontSize: 26,
    fontFamily: fontFamily.primaryMedium,
  },
  subheaderText: {
    marginTop: '5%',
    textAlign: 'center',
    lineHeight: 24.5,
    color: Colors.WHITE,
    fontSize: 18,
    fontFamily: fontFamily.primaryRegular,
  },
  subsubheaderText: {
    marginTop: 15,
    textAlign: 'center',
    lineHeight: 24.5,
    color: Colors.WHITE,
    fontSize: 18,
    fontFamily: fontFamily.primaryLight,
    marginBottom: '8%',
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
