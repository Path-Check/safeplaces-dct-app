import React from 'react';
import { Dimensions, ImageBackground, StatusBar, View } from 'react-native';
import Pulse from 'react-native-pulse';
import { SvgXml } from 'react-native-svg';

import { Icons, Images } from '../../assets';
import { Typography } from '../../components/Typography';
import { Theme } from '../../constants/themes';
import { isGPS } from '../../COVIDSafePathsConfig';
import { useAssets } from '../../TracingStrategyAssets';
import { styles } from './style';

import { Colors } from '../../styles';

type AllServicesOnProps = {
  noHaAvailable: boolean;
};

export const AllServicesOnScreen = ({
  noHaAvailable,
}: AllServicesOnProps): JSX.Element => {
  const {
    allServicesOnScreenHeader,
    allServicesOnScreenSubheader,
    allServicesOnNoHaAvailableSubHeader,
  } = useAssets();
  const size = Dimensions.get('window').height;

  const allServicesOnScreenHeaderText: string = allServicesOnScreenHeader as string;
  const allServicesOnScreenSubheaderText: string = allServicesOnScreenSubheader as string;
  const allServicesOnNoHaAvailableSubHeaderText: string = allServicesOnNoHaAvailableSubHeader as string;

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

        <View style={styles.mainContainer}>
          <View style={styles.contentAbovePulse} />
          <View style={styles.contentBelowPulse}>
            <Typography style={styles.mainTextBelow}>
              {allServicesOnScreenHeaderText}
            </Typography>
            <Typography style={styles.subheaderText}>
              {allServicesOnScreenSubheaderText}
            </Typography>
            {noHaAvailable && (
              <Typography style={styles.subheaderText}>
                {allServicesOnNoHaAvailableSubHeaderText}
              </Typography>
            )}
          </View>
        </View>
      </ImageBackground>
    </Theme>
  );
};
