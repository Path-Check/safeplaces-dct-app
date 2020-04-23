import React, { Component } from 'react';
import { Alert, BackHandler, StyleSheet, View } from 'react-native';

import NavigationBarWrapper from '../components/NavigationBarWrapper';
import { CATCHA_URL } from '../constants/apis';
import HCaptcha from '../services/CaptchaService';

class CaptchaScreen extends Component {
  onMessage = event => {
    if (event && event.nativeEvent.data) {
      if (['cancel', 'error', 'expired'].includes(event.nativeEvent.data)) {
        console.log('Verified code failed');
        Alert.alert('Captcha Response', `captcha ${event.nativeEvent.data}`, [
          {
            text: 'OK',
          },
        ]);
      } else {
        console.log('Verified code received', event.nativeEvent.data);
        Alert.alert('Captcha Response', 'response received', [
          {
            text: 'OK',
          },
        ]);
      }
    }
  };

  backToMain() {
    this.props.navigation.goBack();
  }

  handleBackPress = () => {
    this.props.navigation.goBack();
    return true;
  };

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  render() {
    return (
      <NavigationBarWrapper title='' onBackPress={this.backToMain.bind(this)}>
        <View style={styles.mainContainer}>
          <HCaptcha uri={CATCHA_URL} onMessage={this.onMessage} />
        </View>
      </NavigationBarWrapper>
    );
  }
}

const styles = StyleSheet.create({
  // Container covers the entire screen
  mainContainer: {
    flex: 1,
  },
});
export default CaptchaScreen;
