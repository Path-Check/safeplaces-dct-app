import React, { Component } from 'react';
import {
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
import BackgroundOverlayImage from './../assets/images/homeScreenBackgroundOverlay.png';
import BackgroundImageAtRisk from './../assets/images/backgroundAtRisk.png';
import Colors from '../constants/colors';
import LocationServices from '../services/LocationService';
import BroadcastingServices from '../services/BroadcastingService';
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import exportImage from './../assets/images/export.png';
import FontWeights from '../constants/fontWeights';
import ButtonWrapper from '../components/ButtonWrapper';
import Pulse from 'react-native-pulse';

import {
  check,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';

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
    <SvgXml
      style={styles.stateIcon}
      xml={icon}
      width={size ? size : 80}
      height={size ? size : 80}
    />
  );
};

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

class LocationTracking extends Component {
  constructor(props) {
    super(props);

    let currentState;
    if (this.isLocationEnabled()) {
      currentState = StateEnum.UNKNOWN;
    } else {
      // TODO: logic for detecting if you're at risk
      if (false) {
        currentState = StateEnum.AT_RISK;
      } else {
        currentState = StateEnum.NO_CONTACT;
      }
    }

    this.state = {
      timer_intersect: null,
      isLogging: '',
      currentState: StateEnum.NO_CONTACT,
    };
  }

  // NEED TO DEDUP THIS CODE FROM Onboarding5.js
  isLocationEnabled() {
    // NEED TO TEST ON ANNDROID
    let locationPermission;
    if (Platform.OS === 'ios') {
      locationPermission = PERMISSIONS.IOS.LOCATION_ALWAYS;
    } else {
      locationPermission = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
    }
    check(locationPermission)
      .then(result => {
        switch (result) {
          case RESULTS.GRANTED:
            return true;
          case RESULTS.UNAVAILABLE:
          case RESULTS.BLOCKED:
            return false;
        }
      })
      .catch(error => {
        console.log('error checking location: ' + error);
      });
  }

  componentDidMount() {
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

  intersect_tick = () => {
    // This function is called once every 12 hours.  It should do several things:

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
                // (info_url might have changed, etc.)

                // TODO: authority_list, match by authority_list.url, then re-save "authority_name", "info_website" and
                // "publish_date_utc" (we should notify users if their authority is no longer functioning.)
                // console.log('Received data from authority.url=', authority.url);

                IntersectSet(responseJson.concern_points);
              });
          }
        } else {
          console.log('No authority list');
          return;
        }
      })
      .catch(error => console.log('Failed to load authority list', error));
  };

  componentWillUnmount() {
    clearInterval(this.state.timer_intersect);
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

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
      BroadcastingServices.start();
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
        BroadcastingServices.stop(this.props.navigation);
        this.setState({
          isLogging: false,
        });
      }
    });
  };

  // news() {
  //   this.props.navigation.navigate('NewsScreen', {});
  // }

  licenses() {
    this.props.navigation.navigate('LicensesScreen', {});
  }

  settings() {
    this.props.navigation.navigate('SettingsScreen', {});
  }

  willParticipate = () => {
    SetStoreData('PARTICIPATE', 'true').then(() => LocationServices.start());
    this.setState({
      isLogging: true,
    });
  };

  notifications() {
    this.props.navigation.navigate('NotificationScreen', {});
  }

  willParticipate = () => {
    SetStoreData('PARTICIPATE', 'true').then(() => {
      LocationServices.start();
      BroadcastingServices.start();
    });
    this.setState({
      isLogging: true,
    });
  };

  setOptOut = () => {
    LocationServices.stop(this.props.navigation);
    BroadcastingServices.stop(this.props.navigation);
    this.setState({
      isLogging: false,
    });
  };

  // getMenuItem = () => {
  //   return (
  //     <Menu
  //       style={{
  //         position: 'absolute',
  //         alignSelf: 'flex-end',
  //         zIndex: 10,
  //         marginTop: '5.5%',
  //       }}>
  //       <MenuTrigger style={{ marginTop: 14 }}>
  //         <Image
  //           source={kebabIcon}
  //           style={{
  //             width: 15,
  //             height: 28,
  //             padding: 14,
  //           }}
  //         />
  //       </MenuTrigger>
  //       <MenuOptions>
  //         <MenuOption
  //           onSelect={() => {
  //             this.licenses();
  //           }}>
  //           <Text style={styles.menuOptionText}>Licenses</Text>
  //         </MenuOption>
  //         <MenuOption
  //           onSelect={() => {
  //             this.notifications();
  //           }}>
  //           <Text style={styles.menuOptionText}>Notifications</Text>
  //         </MenuOption>
  //       </MenuOptions>
  //     </Menu>
  //   );
  // };

  // getTrackingComponent = () => {
  //   return (
  //     <>
  //       <Image
  //         source={pkLogo}
  //         style={{
  //           width: 132,
  //           height: 164.4,
  //           alignSelf: 'center',
  //           marginTop: 15,
  //           marginBottom: 15,
  //         }}
  //       />
  //       <ButtonWrapper
  //         title={languages.t('label.home_stop_tracking')}
  //         onPress={() => this.setOptOut()}
  //         bgColor={Colors.RED_BUTTON}
  //         toBgColor={Colors.RED_TO_BUTTON}
  //       />
  //       <Text style={styles.sectionDescription}>
  //         {languages.t('label.home_stop_tracking_description')}
  //       </Text>

  //       <ButtonWrapper
  //         title={languages.t('label.home_check_risk')}
  //         onPress={() => this.overlap()}
  //         bgColor={Colors.GRAY_BUTTON}
  //         toBgColor={Colors.Gray_TO_BUTTON}
  //       />
  //       <Text style={styles.sectionDescription}>
  //         {languages.t('label.home_check_risk_description')}
  //       </Text>
  //     </>
  //   );
  // };

  // getNotTrackingComponent = () => {
  //   return (
  //     <>
  //       <Image
  //         source={pkLogo}
  //         style={{
  //           width: 132,
  //           height: 164.4,
  //           alignSelf: 'center',
  //           marginTop: 15,
  //           marginBottom: 30,
  //           opacity: 0.3,
  //         }}
  //       />
  //       <ButtonWrapper
  //         title={languages.t('label.home_start_tracking')}
  //         onPress={() => this.willParticipate()}
  //         bgColor={Colors.BLUE_BUTTON}
  //         toBgColor={Colors.BLUE_TO_BUTTON}
  //       />
  //       <Text style={styles.sectionDescription}>
  //         {languages.t('label.home_start_tracking_description')}
  //       </Text>
  //     </>
  //   );
  // };

  // getActionButtons = () => {
  //   if (!this.state.isLogging) {
  //     return;
  //   }
  //   return (
  //     <View style={styles.actionButtonsView}>
  //       <TouchableOpacity
  //         onPress={() => this.import()}
  //         style={styles.actionButtonsTouchable}>
  //         <Image
  //           style={styles.actionButtonImage}
  //           source={exportImage}
  //           resizeMode={'contain'}
  //         />
  //         <Text style={styles.actionButtonText}>
  //           {languages.t('label.import')}
  //         </Text>
  //       </TouchableOpacity>

  //       <TouchableOpacity
  //         onPress={() => this.export()}
  //         style={styles.actionButtonsTouchable}>
  //         <Image
  //           style={[
  //             styles.actionButtonImage,
  //             { transform: [{ rotate: '180deg' }] },
  //           ]}
  //           source={exportImage}
  //           resizeMode={'contain'}
  //         />
  //         <Text style={styles.actionButtonText}>
  //           {languages.t('label.export')}
  //         </Text>
  //       </TouchableOpacity>

  //       <TouchableOpacity
  //         onPress={() => this.news()}
  //         style={styles.actionButtonsTouchable}>
  //         <Image
  //           style={styles.actionButtonImage}
  //           source={news}
  //           resizeMode={'contain'}
  //         />
  //         <Text style={styles.actionButtonText}>
  //           {languages.t('label.news')}
  //         </Text>
  //       </TouchableOpacity>
  //     </View>
  //   );
  // };

  getBackground() {
    if (this.state.currentState == StateEnum.AT_RISK) {
      return BackgroundImageAtRisk;
    }
    return BackgroundImage;
  }

  getSettings() {
    return (
      <TouchableOpacity
        style={styles.settingsContainer}
        onPress={() => {
          this.props.navigation.replace('SettingsScreen');
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
            image={exportImage}
            color='#FFFFFF40'
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
        <StateIcon size={height} status={this.state.currentState} />
      </View>
    );
  }

  getMainText() {
    switch (this.state.currentState) {
      case StateEnum.NO_CONTACT:
        return 'label.home_no_contact_header';
      case StateEnum.AT_RISK:
        return 'label.home_at_risk_header';
      case StateEnum.UNKNOWN:
        return 'label.home_unknown_header';
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

  getCTAIfNeeded() {
    let buttonLabel;
    let buttonFunction;
    if (this.state.currentState === StateEnum.NO_CONTACT) {
      return;
    } else if (this.state.currentState === StateEnum.AT_RISK) {
      buttonLabel = 'label.home_next_steps';
      buttonFunction = () => {};
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
          buttonColor={Colors.VIOLET}
          bgColor={Colors.WHITE}
        />
      </View>
    );
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
            <Text style={styles.mainText}>
              {languages.t(this.getMainText())}
            </Text>
            <Text style={styles.subheaderText}>
              {languages.t(this.getSubText())}
            </Text>
            {this.getCTAIfNeeded()}
          </View>
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
    width: width * 0.6,
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
    top: '7%',
  },
  pulseContainer: {
    position: 'absolute',
    resizeMode: 'contain',
    top: '-13%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  mainText: {
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
});

export default LocationTracking;
