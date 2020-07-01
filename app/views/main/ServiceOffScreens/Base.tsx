import React from 'react';
import {
  Dimensions,
  ImageBackground,
  View,
  Text,
  NativeSyntheticEvent,
  NativeTouchEvent,
  TouchableOpacity,
} from 'react-native';
import { SvgXml } from 'react-native-svg';

import { Typography } from '../../../components/Typography';
import { Theme } from '../../../constants/themes';
import { useStatusBarEffect } from '../../../navigation';
import { styles } from '../style';

import { Icons, Images } from '../../../assets';

export interface ServiceOffScreenProps {
  header: string;
  subheader: string;
  button?: {
    label: string;
    onPress: (ev: NativeSyntheticEvent<NativeTouchEvent>) => void;
  };
}

export const ServiceOffScreen = ({
  header,
  subheader,
  button,
}: ServiceOffScreenProps): JSX.Element => {
  const size = Dimensions.get('window').height;

  const subheaderText = subheader;
  useStatusBarEffect('light-content');

  return (
    <Theme use='violet'>
      <ImageBackground
        source={Images.BlueGradientBackground}
        style={styles.backgroundImage}>
        <View style={styles.pulseContainer}>
          <SvgXml
            xml={Icons.StateUnknown}
            width={size ? size : 80}
            height={size ? size : 80}
          />
        </View>
      </ImageBackground>

      <View style={styles.mainContainer}>
        <View style={styles.contentAbovePulse} />
        <View style={styles.contentBelowPulse}>
          <Text style={styles.mainTextBelow}>{header}</Text>
          <Typography style={styles.subheaderText}>{subheaderText}</Typography>
          {button && (
            <TouchableOpacity
              onPress={button.onPress}
              style={styles.buttonContainer}>
              <Typography>{button.label}</Typography>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Theme>
  );
};
