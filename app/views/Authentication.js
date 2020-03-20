import React, { Component } from 'react';

import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import {GetStoreData} from '../helpers/General';

import TouchID from 'react-native-touch-id';
import colors from "../constants/colors";

class Authentication extends Component {
  constructor(props) {
    super(props);

    this.state = {
      initialRouteName:'',

    }
  }

  componentDidMount() {
    GetStoreData('PARTICIPATE')
      .then(isParticipating => {
        console.log(isParticipating);
        this.setState({
          initialRouteName: isParticipating === 'true' ? 'LocationTrackingScreen' : 'Slider'
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
      passcodeFallback: true
    };

    TouchID.isSupported(supportConfig)
      .then(biometryType => {
        TouchID.authenticate('', authConfig)
        .then(success => {
          this.props.navigation.navigate(this.state.initialRouteName);
        })
        .catch(error => {
          console.log(error);
          if (error.name === 'LAErrorTouchIDNotEnrolled' // iOS
            || error.name === 'LAErrorTouchIDNotAvailable' 
            || error.code === 'NOT_SUPPORTED' // Android
            || error.code === 'NOT_AVAILABLE'
            || error.code === 'NOT_PRESENT'
            || error.code === 'NOT_ENROLLED'
            ) {
            this.props.navigation.navigate(this.state.initialRouteName);
          }
        })
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
          <TouchableOpacity onPress={() => this.authenticate()} style = {styles.touchable}>
            <Text style={styles.text}>
              Authenticate to View Your PrivateKit
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}


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
    touchable:{
      borderRadius: 8,
      backgroundColor: "#454f63",
      height: 40,
      padding: 10,
      alignSelf:'center',
      justifyContent:'center'
    },
    text:{
      opacity: 0.56,
      fontFamily: "OpenSans-Bold",
      fontSize: 20,
      lineHeight: 20,
      letterSpacing: 0,
      textAlign: "center",
      color: "#ffffff",
      marginTop:6
    }
});

export default Authentication;