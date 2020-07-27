import React from 'react';
import {
  Dimensions,
  ImageBackground,
  View,
  Text,
  StatusBar,
} from 'react-native';
import { SvgXml } from 'react-native-svg';

import { Typography } from '../../../components/Typography';
import { useStatusBarEffect } from '../../../navigation';
import { styles } from '../style';

import { Icons, Images } from '../../../assets';
import { Button } from '../../../components/Button';

export interface ServiceOffScreenProps {
  header: string;
  subheader: string;
  button?: {
    label: string;
    onPress: () => void;
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
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={Images.BlueGradientBackground}
        style={styles.backgroundImage}>
        <StatusBar
          barStyle='light-content'
          backgroundColor='transparent'
          translucent
        />
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
          {button && <Button label={button.label} onPress={button.onPress} />}
        </View>
      </View>
    </View>
  );
};
