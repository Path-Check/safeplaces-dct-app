import React, { Component } from 'react';
import {
  BackHandler,
  Dimensions,
  ImageBackground,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { SvgXml } from 'react-native-svg';

import BackgroundImage from './../assets/images/launchScreenBackground.png';
import StateAtRisk from './../assets/svgs/stateAtRisk';
import StateNoContact from './../assets/svgs/stateNoContact';
import { isPlatformAndroid } from './../Util';
import ButtonWrapper from '../components/ButtonWrapper';
import { Typography } from '../components/Typography';
import Colors from '../constants/colors';
import fontFamily from '../constants/fonts';
import languages from '../locales/languages'; // TODO internationalization
import LocationServices from '../services/LocationService';

const StateEnum = {
  SCAN_SUCCESS: 0,
  SCAN_FAIL: 1,
};

const StateIcon = ({ status, size }) => {
  let icon;
  switch (status) {
    case StateEnum.SCAN_SUCCESS:
      icon = StateNoContact;
      break;
    case StateEnum.SCAN_FAIL:
      icon = StateAtRisk;
      break;
  }
  return (
    <SvgXml xml={icon} width={size ? size : 80} height={size ? size : 80} />
  );
};

const height = Dimensions.get('window').height;

class QRScan extends Component {
  constructor(props) {
    super(props);

    if (isPlatformAndroid()) {
      StatusBar.setBackgroundColor(Colors.TRANSPARENT);
      StatusBar.setBarStyle('light-content');
      StatusBar.setTranslucent(true);
    }

    this.state = {
      currentState: StateEnum.SCAN_SUCCESS,
    };
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    this.unsubscribeFocus = this.props.navigation.addListener('focus', () => {
      this.processRouteParams();
    });
    this.unsubscribeState = this.props.navigation.addListener('state', () => {
      this.processRouteParams();
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    this.unsubscribeFocus();
    this.unsubscribeState();
  }

  processRouteParams() {
    const {
      latitudeInteger,
      latitudeFraction,
      longitudeInteger,
      longitudeFraction,
    } = this.props.route.params;
    this.saveCoordinates(
      latitudeInteger,
      latitudeFraction,
      longitudeInteger,
      longitudeFraction,
    );
  }

  saveCoordinates(
    latitudeInteger,
    latitudeFraction,
    longitudeInteger,
    longitudeFraction,
  ) {
    if (
      this.isValidCoordinates(
        latitudeInteger,
        latitudeFraction,
        longitudeInteger,
        longitudeFraction,
      )
    ) {
      const latitudeParsed = Number(`${latitudeInteger}.${latitudeFraction}`);
      const longitudeParsed = Number(
        `${longitudeInteger}.${longitudeFraction}`,
      );
      LocationServices.saveLocation({
        latitude: latitudeParsed,
        longitude: longitudeParsed,
        time: Date.now(),
      });
      this.setState({ currentState: StateEnum.SCAN_SUCCESS });
    } else {
      this.setState({ currentState: StateEnum.SCAN_FAIL });
    }
  }

  isValidCoordinates(
    latitudeInteger,
    latitudeFraction,
    longitudeInteger,
    longitudeFraction,
  ) {
    const isValidInteger = num => {
      const regex = /^\d+?$/;
      return typeof num === 'string' && regex.test(num);
    };
    return (
      isValidInteger(latitudeInteger) &&
      isValidInteger(latitudeFraction) &&
      isValidInteger(longitudeInteger) &&
      isValidInteger(longitudeFraction)
    );
  }

  handleBackPress = () => {
    BackHandler.exitApp(); // works best when the goBack is async
    return true;
  };

  getBackground() {
    return BackgroundImage;
  }

  getMainText() {
    switch (this.state.currentState) {
      case StateEnum.SCAN_SUCCESS:
        return (
          <Typography style={styles.mainTextBelow}>
            {languages.t('label.qr_successful_title')}
          </Typography>
        );
      case StateEnum.SCAN_FAIL:
        return (
          <Typography style={styles.mainTextBelow}>
            {languages.t('label.qr_fail_title')}
          </Typography>
        );
    }
  }

  getSubText() {
    switch (this.state.currentState) {
      case StateEnum.SCAN_SUCCESS:
        return languages.t('label.qr_successful_subtitle');
      case StateEnum.SCAN_FAIL:
        return languages.t('label.qr_fail_subtitle');
    }
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
        <View style={styles.iconContainer}>
          <StateIcon size={height} status={this.state.currentState} />
        </View>
        <View style={styles.mainContainer}>
          <View style={styles.content}>
            {this.getMainText()}
            <Typography style={styles.subheaderText}>
              {this.getSubText()}
            </Typography>
            <View style={styles.buttonContainer}>
              <ButtonWrapper
                title='Home'
                onPress={() => {
                  this.props.navigation.navigate('LocationTrackingScreen', {});
                }}
                buttonColor={Colors.BLUE_BUTTON}
                bgColor={Colors.WHITE}
              />
            </View>
          </View>
        </View>
      </ImageBackground>
    );
  }
}

const ICON_GAP = 80;

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
    top: '-10%',
    left: 0,
    right: 0,
    height: '90%',
    paddingHorizontal: '12%',
    paddingBottom: 12,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: ICON_GAP,
  },
  iconContainer: {
    position: 'absolute',
    resizeMode: 'contain',
    height: '100%',
    top: '-13%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  buttonContainer: {
    top: 24,
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
});

export default QRScan;
