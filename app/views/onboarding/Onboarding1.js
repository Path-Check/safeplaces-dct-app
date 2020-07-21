import React, { Component } from 'react';
import {
  Dimensions,
  ImageBackground,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import BackgroundImage from './../../assets/images/launchScreenBackground.png';
import BackgroundOverlayImage from './../../assets/images/launchScreenBackgroundOverlay.png';
import languages, {
  LOCALE_LIST,
  getUserLocaleOverride,
  setUserLocaleOverride,
  supportedDeviceLanguageOrEnglish,
} from './../../locales/languages';
import { EulaModal } from '../../components/EulaModal';
import NativePicker from '../../components/NativePicker';
import { Typography } from '../../components/Typography';
import Colors from '../../constants/colors';
import fontFamily from '../../constants/fonts';
import { LANG_OVERRIDE } from '../../constants/storage';
import { Theme } from '../../constants/themes';
import { SetStoreData } from '../../helpers/General';
import { sharedStyles } from './styles';

const width = Dimensions.get('window').width;

class Onboarding extends Component {
  constructor(props) {
    super(props);

    this.state = {
      locale: supportedDeviceLanguageOrEnglish(),
    };
  }

  componentDidMount() {
    getUserLocaleOverride().then(locale => {
      if (locale) {
        this.setState({ locale });
      }
    });
  }

  onLocaleChange = async locale => {
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
      <Theme use='violet'>
        <ImageBackground
          source={BackgroundImage}
          style={styles.backgroundImage}>
          <ImageBackground
            source={BackgroundOverlayImage}
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
                  items={LOCALE_LIST}
                  value={this.state.locale}
                  onValueChange={this.onLocaleChange}>
                  {({ label, openPicker }) => (
                    <TouchableOpacity
                      onPress={openPicker}
                      style={{
                        ...styles.languageSelector,
                        backgroundColor: Colors.WHITE,
                      }}>
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
              <View style={sharedStyles.footerContainer}>
                <EulaModal
                  continueFunction={async () => {
                    this.props.navigation.replace('Onboarding2');
                    await SetStoreData(LANG_OVERRIDE, this.state.locale);
                  }}
                  selectedLocale={this.state.locale}
                />
              </View>
            </View>
          </ImageBackground>
        </ImageBackground>
      </Theme>
    );
  }
}

const styles = StyleSheet.create({
  backgroundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    flex: 1,
    backgroundColor: Colors.BLUE_RIBBON,
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
    color: Colors.WHITE,
    fontSize: 26,
    fontFamily: fontFamily.primaryMedium,
  },
  // eslint-disable-next-line react-native/no-color-literals
  languageSelector: {
    // alpha needs to be in the bg color otherwise it fades the contained text
    backgroundColor: Colors.WHITE,
    paddingVertical: 4,
    paddingHorizontal: 11,
    borderRadius: 100,
  },
  languageSelectorText: {
    fontSize: 12,
    color: Colors.BLUE_RIBBON,
    paddingVertical: 4,
    paddingHorizontal: 11,
    opacity: 1,
    textAlign: 'center',
    textTransform: 'uppercase',
    fontWeight: '800',
  },
});

export default Onboarding;
