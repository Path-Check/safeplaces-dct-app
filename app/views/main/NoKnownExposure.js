import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, ImageBackground, StatusBar, View } from 'react-native';
import Pulse from 'react-native-pulse';
import { SvgXml } from 'react-native-svg';

import { Icons, Images } from '../../assets';
import { Typography } from '../../components';
import Colors from '../../constants/colors';
import { Theme } from '../../constants/themes';
import { MayoButton } from './MayoButton';
import { styles } from './style';

export const NoKnownExposure = () => {
  const size = Dimensions.get('window').height;
  const { t } = useTranslation();
  return (
    <Theme use='violet'>
      <ImageBackground
        source={Images.LaunchScreenBackground}
        style={styles.backgroundImage}>
        <StatusBar
          barStyle='light-content'
          backgroundColor='transparent'
          translucent
        />
        <View style={styles.pulseContainer}>
          <Pulse
            image={{ exportImage: Images.Export }}
            color={Colors.PULSE_WHITE}
            numPulses={3}
            diameter={400}
            speed={20}
            duration={2000}
          />
          <SvgXml
            xml={Icons.StateNoContact}
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
