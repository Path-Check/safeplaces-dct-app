import React, { Component } from 'react';
import {
  BackHandler,
  Dimensions,
  ImageBackground,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { SvgXml } from 'react-native-svg';

import BackgroundImage from './../assets/images/launchScreenBackground.png';
import StateAtRisk from './../assets/svgs/stateAtRisk';
import StateNoContact from './../assets/svgs/stateNoContact';
import { isPlatformAndroid } from './../Util';
import { Button } from '../components/Button';
import { Typography } from '../components/Typography';
import Colors from '../constants/colors';
import fontFamily from '../constants/fonts';
import languages from '../locales/languages'; // TODO internationalization
import LocationServices from '../services/LocationService';

const StateEnum = {
  DEFAULT: 0,
  SCAN_SUCCESS: 1,
  SCAN_FAIL: 2,
  SCAN_IN_PROGRESS: 3,
};

const StateIcon = ({ status, size }) => {
  let icon;
  switch (status) {
    case StateEnum.DEFAULT:
      icon = null;
      break;
    case StateEnum.SCAN_SUCCESS:
      icon = StateNoContact;
      break;
    case StateEnum.SCAN_FAIL:
      icon = StateAtRisk;
      break;
    case StateEnum.SCAN_IN_PROGRESS:
      icon = StateNoContact;
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
      currentState: StateEnum.DEFAULT,
    };
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    const handleStateChange = () => {
      if (this.props.navigation.isFocused()) {
        this.onNavigate();
      } else {
        this.setState({ currentState: StateEnum.DEFAULT });
      }
    };
    this.unsubscribeFocus = this.props.navigation.addListener(
      'focus',
      handleStateChange,
    );
    this.unsubscribeState = this.props.navigation.addListener(
      'state',
      handleStateChange,
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    this.unsubscribeFocus();
    this.unsubscribeState();
  }

  onNavigate() {
    if (this.props.route && this.props.route.params) {
      const { latitude, longitude } = this.props.route.params;
      if (typeof latitude !== 'undefined' && typeof longitude !== 'undefined') {
        this.saveCoordinates(latitude, longitude);
      } else {
        this.setState({ currentState: StateEnum.SCAN_IN_PROGRESS });
      }
    } else {
      this.setState({ currentState: StateEnum.SCAN_IN_PROGRESS });
    }
  }

  onScanSuccess(e) {
    const url = e && e.data;
    const split_1 = url && url.split('/qr/');
    const split_2 = split_1 && split_1.length === 2 && split_1[1].split('/');
    const latitude = split_2 && split_2.length === 2 && split_2[0];
    const longitude = split_2 && split_2.length === 2 && split_2[1];
    if (typeof latitude !== 'undefined' && typeof longitude !== 'undefined') {
      this.saveCoordinates(latitude, longitude);
    } else {
      this.setState({ currentState: StateEnum.SCAN_FAIL });
    }
  }

  saveCoordinates(latitude, longitude) {
    if (this.isValidCoordinates(latitude, longitude)) {
      LocationServices.saveLocation({
        latitude: Number(latitude),
        longitude: Number(longitude),
        time: Date.now(),
      });
      this.setState({ currentState: StateEnum.SCAN_SUCCESS });
    } else {
      this.setState({ currentState: StateEnum.SCAN_FAIL });
    }
  }

  isValidCoordinates(latitude, longitude) {
    const isValid = num => {
      const regex = /^(-?\d+\.?\d*|\.\d+)$/;
      return typeof num === 'string' && regex.test(num);
    };
    return isValid(latitude) && isValid(longitude);
  }

  handleBackPress = () => {
    this.props.navigation.goBack();
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
        {(this.state.currentState === StateEnum.SCAN_SUCCESS ||
          this.state.currentState === StateEnum.SCAN_FAIL) && (
          <View style={styles.iconContainer}>
            <StateIcon size={height} status={this.state.currentState} />
          </View>
        )}
        {(this.state.currentState === StateEnum.SCAN_SUCCESS ||
          this.state.currentState === StateEnum.SCAN_FAIL) && (
          <View style={styles.mainContainer}>
            <View style={styles.content}>
              {this.getMainText()}
              <Typography style={styles.subheaderText}>
                {this.getSubText()}
              </Typography>
              <View style={styles.buttonContainer}>
                <Button
                  label={languages.t('label.qr_exit')}
                  onPress={() => {
                    this.props.navigation.navigate('Main', {});
                  }}
                />
              </View>
            </View>
          </View>
        )}
        {this.state.currentState === StateEnum.SCAN_IN_PROGRESS && (
          <View style={styles.qrScanContainer}>
            <QRCodeScanner
              onRead={this.onScanSuccess.bind(this)}
              flashMode={RNCamera.Constants.FlashMode.off}
            />
            <Button
              label={languages.t('label.qr_scan_cancel')}
              style={styles.qrCancelButton}
              onPress={() => {
                this.props.navigation.navigate('Main', {});
              }}
            />
          </View>
        )}
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
  qrScanContainer: {
    height: '100%',
    paddingBottom: 10,
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
