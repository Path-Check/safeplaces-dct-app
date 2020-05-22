import React from 'react';
import {
  Dimensions,
  ImageBackground,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

import { Images } from '../../assets';
import { Button } from '../../components/Button';
import { Type, Typography } from '../../components/Typography';
import Colors from '../../constants/colors';
import fontFamily from '../../constants/fonts';
import { config } from '../../COVIDSafePathsConfig';
import languages from '../../locales/languages';
import { sharedStyles } from './styles';

const width = Dimensions.get('window').width;

const Onboarding = props => {
  const isGPS = config.tracingStrategy === 'gps';
  const backgroundImage = isGPS
    ? Images.LaunchScreen2
    : Images.LaunchScreen2BT; 
  const headerText = isGPS
    ? languages.t('label.launch_screen2_header_location')
    : languages.t('label.launch_screen2_header_bluetooth');
  const subheaderText = isGPS
    ? languages.t('label.launch_screen2_subheader_location')
    : languages.t('label.launch_screen2_subheader_bluetooth');

  return (
    <View style={styles.mainContainer}>
      <StatusBar
        barStyle='dark-content'
        backgroundColor='transparent'
        translucent
      />
      <ImageBackground
        source={backgroundImage}
        style={styles.backgroundImage}
      />
      <View style={styles.contentContainer}>
        <Typography style={styles.headerText} use={Type.Headline2}>
          {headerText}
        </Typography>
        <Typography style={styles.subheaderText}>
          {subheaderText}
        </Typography>
      </View>
      <View style={styles.verticalSpacer} />
      <View style={sharedStyles.footerContainer}>
        <Button
          label={languages.t('label.launch_next')}
          onPress={() => {
            props.navigation.replace('Onboarding3');
          }}
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
    flex: 2,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  headerText: {
    color: Colors.VIOLET,
  },
  subheaderText: {
    marginTop: '6%',
    color: Colors.VIOLET,
    fontSize: 16,
    fontFamily: fontFamily.primaryRegular,
  },
  verticalSpacer: {
    flex: 1,
  },
});

export default Onboarding;
