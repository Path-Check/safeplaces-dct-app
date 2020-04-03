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
import BackgroundImageAtRisk from './../assets/images/backgroundAtRisk.png';
// import BackgroundOverlayImage from './../assets/images/homeScreenBackgroundOverlay.png';
import Colors from '../constants/colors';
import LocationServices from '../services/LocationService';
import BroadcastingServices from '../services/BroadcastingService';
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import exportImage from './../assets/images/export.png';
import news from './../assets/images/newspaper.png';
import kebabIcon from './../assets/images/kebabIcon.png';
import pkLogo from './../assets/images/PKLogo.png';
import FontWeights from '../constants/fontWeights';
import ButtonWrapper from '../components/ButtonWrapper';
import Pulse from 'react-native-pulse';

import { openSettings } from 'react-native-permissions';

import { GetStoreData, SetStoreData } from '../helpers/General';
import languages from '../locales/languages';

import { SvgXml } from 'react-native-svg';
import StateAtRisk from './../assets/svgs/stateAtRisk';
import StateNoContact from './../assets/svgs/stateNoContact';
import StateUnknown from './../assets/svgs/stateUnknown';
import SettingsGear from './../assets/svgs/settingsGear';

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

class LocationTracking extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLogging: '', // what is this?
      currentState: StateEnum.UNKNOWN,
    };
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
  }

  componentWillUnmount() {
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

  // notifications() {
  //   this.props.navigation.navigate('NotificationScreen', {});
  // }

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
      <TouchableOpacity style={styles.settingsContainer}>
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
          <StateIcon size={80} status={this.state.currentState} />
        </View>
      );
    }
    return (
      <View style={styles.pulseContainer}>
        <StateIcon size={80} status={this.state.currentState} />
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
    if (this.state.currentState === StateEnum.NO_CONTACT) {
      return;
    } else if (this.state.currentState === StateEnum.AT_RISK) {
      buttonLabel = 'label.home_next_steps';
    } else if (this.state.currentState === StateEnum.UNKNOWN) {
      buttonLabel = 'label.home_enable_location';
    }

    return (
      <View style={styles.buttonContainer}>
        <ButtonWrapper
          title={languages.t(buttonLabel)}
          onPress={() => {
            openSettings();
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

        {this.getSettings()}

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
    flex: 1,
  },
  contentContainer: {
    width: width * 0.6,
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    paddingBottom: '15%',
  },
  settingsContainer: {
    // paddingTop: 48,
    // paddingRight: 24,
    marginTop: '14%',
    marginRight: '5%',
    alignSelf: 'flex-end',
  },
  buttonContainer: {
    top: '7%',
  },
  pulseContainer: {
    top: '18%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainText: {
    textAlign: 'center',
    lineHeight: 34,
    color: Colors.WHITE,
    fontWeight: FontWeights.MEDIUM,
    fontSize: 26,
    fontFamily: 'IBM Plex Sans',
  },
  subheaderText: {
    marginTop: '5%',
    textAlign: 'center',
    lineHeight: 24.5,
    color: Colors.WHITE,
    fontWeight: FontWeights.REGULAR,
    fontSize: 18,
    fontFamily: 'IBM Plex Sans',
  },
});

export default LocationTracking;
