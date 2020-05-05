import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dimensions,
  ImageBackground,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { SvgXml } from 'react-native-svg';

import backgroundImage from './../../assets/images/launchScreenBackground.png';
import StateAtRisk from './../../assets/svgs/stateAtRisk';
import { Typography } from './../../components/Typography';
import Colors from './../../constants/colors';
import ButtonWrapper from '../../components/ButtonWrapper';
import { MayoInfo } from './MayoInfo';
import { styles } from './style';

export const ExposurePage = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const buttonLabel = t('label.see_exposure_history');
  const size = Dimensions.get('window').height;

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <StatusBar
        barStyle='light-content'
        backgroundColor='transparent'
        translucent
      />
      <View style={styles.pulseContainer}>
        <SvgXml
          xml={StateAtRisk}
          width={size ? size : 80}
          height={size ? size : 80}
        />
      </View>

      <View style={styles.mainContainer}>
        <View style={styles.contentAbovePulse}>
          <Typography style={styles.mainTextAbove}>
            {t('label.home_at_risk_header')}
          </Typography>
          <Typography style={styles.subsubheaderText}>
            {t('label.home_at_risk_subsubtext')}
          </Typography>
        </View>
        <View style={styles.contentBelowPulse}>
          <Typography style={styles.subheaderText}>
            {t('label.home_at_risk_subtext')}
          </Typography>
          <View style={styles.buttonContainer}>
            <ButtonWrapper
              title={buttonLabel}
              onPress={() => {
                navigation.navigate('ExposureHistoryScreen');
              }}
              buttonColor={Colors.BLUE_BUTTON}
              bgColor={Colors.WHITE}
            />
          </View>
        </View>
      </View>
      <MayoInfo />
    </ImageBackground>
  );
};
