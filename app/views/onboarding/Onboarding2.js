import React from 'react';
import {
  Dimensions,
  ImageBackground,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

import BackgroundImage from './../../assets/images/launchScreen2.png';
import ButtonWrapper from '../../components/ButtonWrapper';
import { Type, Typography } from '../../components/Typography';
import Colors from '../../constants/colors';
import fontFamily from '../../constants/fonts';
import languages from '../../locales/languages';
import { ONBOARDING3_SCREEN_NAME } from './Onboarding3';

const width = Dimensions.get('window').width;

export const ONBOARDING2_SCREEN_NAME = 'Onboarding2Screen';

export const Onboarding2Screen = props => {
  return (
    <View style={styles.mainContainer}>
      <StatusBar
        barStyle='dark-content'
        backgroundColor='transparent'
        translucent
      />
      <ImageBackground
        source={BackgroundImage}
        style={styles.backgroundImage}
      />
      <View style={styles.contentContainer}>
        <Typography style={styles.headerText} use={Type.Headline2}>
          {languages.t('label.launch_screen2_header')}
        </Typography>
        <Typography style={styles.subheaderText}>
          {languages.t('label.launch_screen2_subheader')}
        </Typography>
      </View>
      <View style={styles.footerContainer}>
        <ButtonWrapper
          title={languages.t('label.launch_next')}
          onPress={() => {
            props.navigation.replace(ONBOARDING3_SCREEN_NAME);
          }}
          buttonColor={Colors.WHITE}
          bgColor={Colors.VIOLET_BUTTON}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    width: '100%',
    height: '100%',
    top: '-10%',
    resizeMode: 'cover',
    position: 'absolute',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.INTRO_WHITE_BG,
  },
  contentContainer: {
    width: width * 0.9,
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  headerText: {
    color: Colors.VIOLET,
    width: width * 0.8,
  },
  subheaderText: {
    marginTop: '6%',
    color: Colors.VIOLET,
    fontSize: 15,
    width: width * 0.8,
    fontFamily: fontFamily.primaryRegular,
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    marginBottom: '10%',
    alignSelf: 'center',
  },
});
