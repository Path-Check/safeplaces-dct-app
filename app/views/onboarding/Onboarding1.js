import React from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  ImageBackground,
  StatusBar,
} from 'react-native';
const width = Dimensions.get('window').width;
import BackgroundImage from './../../assets/images/launchScreenBackground.png';
import BackgroundOverlayImage from './../../assets/images/launchScreenBackgroundOverlay.png';
import languages from '../../locales/languages';
import ButtonWrapper from '../../components/ButtonWrapper';
import Colors from '../../constants/colors';
import FontWeights from '../../constants/fontWeights';

const Onboarding = props => {
  return (
    <ImageBackground source={BackgroundImage} style={styles.backgroundImage}>
      <ImageBackground
        source={BackgroundOverlayImage}
        style={styles.backgroundImage}>
        <StatusBar
          barStyle='light-content'
          backgroundColor='transparent'
          translucent={true}
        />

        <View style={styles.mainContainer}>
          <View style={styles.contentContainer}>
            <Text style={styles.mainText}>
              {languages.t('label.launch_screen1_header')}
            </Text>
          </View>
          <View style={styles.footerContainer}>
            <ButtonWrapper
              title={languages.t('label.launch_get_started')}
              onPress={() => {
                props.navigation.replace('Onboarding2');
              }}
              buttonColor={Colors.VIOLET}
              bgColor={Colors.WHITE}
            />
          </View>
        </View>
      </ImageBackground>
    </ImageBackground>
  );
};

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
    color: Colors.WHITE,
    fontWeight: FontWeights.MEDIUM,
    fontSize: 26,
    fontFamily: 'IBM Plex Sans',
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    marginBottom: '10%',
    alignSelf: 'center',
  },
});

export default Onboarding;
