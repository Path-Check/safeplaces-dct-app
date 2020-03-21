import React, {Component} from 'react';

import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Image,
} from 'react-native';

import {GetStoreData} from '../helpers/General';

import TouchID from 'react-native-touch-id';
import colors from '../constants/colors';

import pkLogo from './../assets/images/PKLogo.png';

class Authentication extends Component {
  constructor(props) {
    super(props);

    this.state = {
      initialRouteName: '',
    };
  }

  componentDidMount() {
    GetStoreData('PARTICIPATE')
      .then(isParticipating => {
        console.log(isParticipating);
        this.setState({
          initialRouteName:
            isParticipating === 'true' ? 'LocationTrackingScreen' : 'Slider',
        });
      })
      .catch(error => console.log(error));

    this.authenticate();
  }

  authenticate() {
    console.log('authentication attempt');
    let authConfig = {
      title: 'Authentication Required', // Android
      imageColor: '#e00606', // Android
      imageErrorColor: '#ff0000', // Android
      sensorDescription: 'Touch Sensor', // Android
      sensorErrorDescription: 'Failed', // Android
      cancelText: 'Cancel', // Android
      fallbackLabel: '', // iOS (if empty, then label is hidden)
      unifiedErrors: false, // use unified error messages (default false)
      passcodeFallback: false, // iOS - allows the device to fall back to using the passcode, if faceid/touch is not available. this does not mean that if touchid/faceid fails the first few times it will revert to passcode, rather that if the former are not enrolled, then it will use the passcode.
    };

    let supportConfig = {
      unifiedErrors: false,
      passcodeFallback: true,
    };

    TouchID.isSupported(supportConfig)
      .then(biometryType => {
        TouchID.authenticate('', authConfig)
          .then(success => {
            this.props.navigation.navigate(this.state.initialRouteName);
          })
          .catch(error => {
            console.log(error);
            if (
              error.name === 'LAErrorTouchIDNotEnrolled' || // iOS
              error.name === 'LAErrorTouchIDNotAvailable' ||
              error.code === 'NOT_SUPPORTED' || // Android
              error.code === 'NOT_AVAILABLE' ||
              error.code === 'NOT_PRESENT' ||
              error.code === 'NOT_ENROLLED'
            ) {
              this.props.navigation.navigate(this.state.initialRouteName);
            }
          });
      })
      .catch(error => {
        console.log(error);
        // For the time being, if no biometric login, skip authentication
        this.props.navigation.navigate(this.state.initialRouteName);
      });
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View>
          <Text style={styles.headerTitle}> Private Kit </Text>
          <Image
            source={pkLogo}
            style={{
              width: 132,
              height: 164.4,
              alignSelf: 'center',
              marginTop: 12,
            }}
          />
          <TouchableOpacity
            onPress={() => this.authenticate()}
            style={styles.touchable}>
            <Text style={styles.buttonText}>
              Authenticate to Access Your Private Kit
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const width = Dimensions.get('window').width;

const styles = StyleSheet.create({
  // Container covers the entire screen
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: colors.PRIMARY_TEXT,
    backgroundColor: colors.WHITE,
  },
  headerTitle: {
    textAlign: 'center',
    fontSize: 38,
    padding: 0,
    fontFamily: 'OpenSans-Bold',
  },
  touchable: {
    borderRadius: 12,
    backgroundColor: '#665eff',
    height: 52,
    alignSelf: 'center',
    width: width * 0.7866,
    marginTop: 30,
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 14,
    lineHeight: 19,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#ffffff',
  },
});

export default Authentication;
