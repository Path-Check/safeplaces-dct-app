import React, { Component } from 'react';
import {
  Dimensions,
  ImageBackground,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import languages, {
  getLocaleList,
  getUserLocaleOverride,
  setUserLocaleOverride,
  supportedDeviceLanguageOrEnglish,
} from './../../locales/languages';
import { Images } from '../../assets';
import { NativePicker, Typography } from '../../components';
import { EulaModal } from '../EulaModal';

import { Colors } from '../../styles';

const width = Dimensions.get('window').width;

class Onboarding extends Component {
  constructor(props) {
    super(props);

    this.state = {
      locale: supportedDeviceLanguageOrEnglish(),
    };
  }

  componentDidMount() {
    getUserLocaleOverride().then((locale) => {
      if (locale) {
        this.setState({ locale });
      }
    });
  }

  onLocaleChange = async (locale) => {
    if (locale) {
      try {
        await setUserLocaleOverride(locale);
        this.setState({ locale });
      } catch (err) {
        console.log('Something went wrong in language change', err);
      }
    }
  };

  render() {
    return (
      <ImageBackground
        source={Images.LaunchScreenBackground}
        style={styles.backgroundImage}>
        <ImageBackground
          source={Images.LaunchScreenBackgroundOverlay}
          style={styles.backgroundImage}>
          <StatusBar
            barStyle='light-content'
            backgroundColor='transparent'
            translucent
          />
          <View style={styles.mainContainer}>
            <View
              style={{
                paddingTop: 60,
                position: 'absolute',
                alignSelf: 'center',
                zIndex: 10,
              }}>
              <NativePicker
                items={getLocaleList()}
                value={this.state.locale}
                onValueChange={this.onLocaleChange}>
                {({ label, openPicker }) => (
                  <TouchableOpacity
                    onPress={openPicker}
                    style={styles.languageSelector}>
                    <Typography style={styles.languageSelectorText}>
                      {label}
                    </Typography>
                  </TouchableOpacity>
                )}
              </NativePicker>
            </View>
            <View style={styles.contentContainer}>
              <Typography style={styles.mainText}>
                {languages.t('label.launch_screen1_header')}
              </Typography>
            </View>
            <View style={styles.footerContainer}>
              <EulaModal
                continueFunction={() =>
                  this.props.navigation.replace('Onboarding2')
                }
                selectedLocale={this.state.locale}
              />
            </View>
          </View>
        </ImageBackground>
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
    width: width * 0.75,
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  mainText: {
    textAlign: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    lineHeight: 35,
    color: Colors.white,
    fontSize: 26,
  },
  // eslint-disable-next-line react-native/no-color-literals
  languageSelector: {
    borderWidth: 1,
    borderColor: Colors.white,
    paddingVertical: 4,
    paddingHorizontal: 11,
    borderRadius: 100,
  },
  languageSelectorText: {
    fontSize: 16,
    color: Colors.white,
    paddingVertical: 4,
    paddingHorizontal: 20,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    padding: 24,
    width: '100%',
  },
});

export default Onboarding;
