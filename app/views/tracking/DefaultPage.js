import React from 'react';
import { Dimensions, ImageBackground, StatusBar, View } from 'react-native';
import Pulse from 'react-native-pulse';
import { SvgXml } from 'react-native-svg';

import exportImage from './../../assets/images/export.png';
import BackgroundImage from './../../assets/images/launchScreenBackground.png';
import StateNoContact from './../../assets/svgs/stateNoContact';
import { Typography } from './../../components/Typography';
import Colors from './../../constants/colors';
import languages from '../../locales/languages';
import MayoInfo from './MayoInfo';
import styles from './style';

const size = Dimensions.get('window').height;

const DefaultPage = () => {
  return (
    <ImageBackground source={BackgroundImage} style={styles.backgroundImage}>
      <StatusBar
        barStyle='light-content'
        backgroundColor='transparent'
        translucent
      />
      <View style={styles.pulseContainer}>
        <Pulse
          image={{ exportImage }}
          color={Colors.PULSE_WHITE}
          numPulses={3}
          diameter={400}
          speed={20}
          duration={2000}
        />
        <SvgXml
          xml={StateNoContact}
          width={size ? size : 80}
          height={size ? size : 80}
        />
      </View>
      <View style={styles.mainContainer}>
        <View style={styles.contentAbovePulse} />
        <View style={styles.contentBelowPulse}>
          <Typography style={styles.mainTextBelow}>
            {languages.t('label.home_no_contact_header')}
          </Typography>
          <Typography style={styles.subheaderText}>
            {languages.t('label.home_no_contact_subtext')}
          </Typography>
        </View>
      </View>
      {MayoInfo()}
    </ImageBackground>
  );
};

export default DefaultPage;
