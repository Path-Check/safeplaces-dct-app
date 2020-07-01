import React from 'react';
import { Dimensions, ImageBackground, StatusBar, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Pulse from 'react-native-pulse';
import { SvgXml } from 'react-native-svg';

import { Icons, Images } from '../../assets';
import { Typography } from '../../components/Typography';
import { Theme } from '../../constants/themes';
import { isGPS } from '../../COVIDSafePathsConfig';

import { styles } from './style';
import { Colors } from '../../styles';

type AllServicesOnProps = {
  noHaAvailable: boolean;
};

export const AllServicesOnScreen = ({
  noHaAvailable,
}: AllServicesOnProps): JSX.Element => {
  const { t } = useTranslation();

  const size = Dimensions.get('window').height;

  return (
    <Theme use='violet'>
      <ImageBackground
        source={Images.BlueGradientBackground}
        style={styles.backgroundImage}>
        <StatusBar
          barStyle='light-content'
          backgroundColor='transparent'
          translucent
        />
        <View style={styles.pulseContainer}>
          {isGPS && (
            <Pulse
              image={{ exportImage: Images.Export }}
              color={Colors.lightestGray}
              numPulses={3}
              diameter={400}
              speed={20}
              duration={2000}
            />
          )}
          <SvgXml
            xml={Icons.StateNoContact}
            width={size ? size : 80}
            height={size ? size : 80}
          />
        </View>
      </ImageBackground>

      <View style={styles.mainContainer}>
        <View style={styles.contentAbovePulse} />
        <View style={styles.contentBelowPulse}>
          <Typography style={styles.mainTextBelow}>
            {t('home.gps.all_services_on_header')}
          </Typography>
          <Typography style={styles.subheaderText}>
            {t('home.gps.all_services_on_subheader')}
          </Typography>
          {noHaAvailable && (
            <Typography style={styles.subheaderText}>
              {t('home.gps.all_services_on_no_ha_available')}
            </Typography>
          )}
        </View>
      </View>
    </Theme>
  );
};
