import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, ImageBackground, StatusBar, View } from 'react-native';
import Pulse from 'react-native-pulse';
import { SvgXml } from 'react-native-svg';

import exportImage from './../../assets/images/export.png';
import backgroundImage from './../../assets/images/launchScreenBackground.png';
import StateNoContact from '../../assets/svgs/stateNoContact';
import { Typography } from '../../components/Typography';
import Colors from '../../constants/colors';
import { Theme } from '../../constants/themes';
import { MayoButton } from './MayoButton';
import { styles } from './style';

export const NoKnownExposure = () => {
  const size = Dimensions.get('window').height;
  const { t } = useTranslation();
  return (
    <Theme use='violet'>
      <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
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
              {t('label.home_no_contact_header')}
            </Typography>
            <Typography style={styles.subheaderText}>
              {t('label.home_no_contact_subtext')}
            </Typography>
          </View>
        </View>
        <MayoButton />
      </ImageBackground>
    </Theme>
  );
};
