import React from 'react';
import {
  Dimensions,
  ImageBackground,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { SvgXml } from 'react-native-svg';

import BackgroundImageAtRisk from './../../assets/images/backgroundAtRisk.png';
import StateAtRisk from './../../assets/svgs/stateAtRisk';
import { Typography } from './../../components/Typography';
import Colors from './../../constants/colors';
import ButtonWrapper from '../../components/ButtonWrapper';
import languages from '../../locales/languages';
import MayoInfo from './MayoInfo';
import styles from './style';

const buttonLabel = languages.t('label.see_exposure_history');
const buttonFunction = () => {
  this.props.navigation.navigate('ExposureHistoryScreen');
};
const size = Dimensions.get('window').height;

const ExposurePage = () => {
  return (
    <ImageBackground
      source={BackgroundImageAtRisk}
      style={styles.backgroundImage}>
      <StatusBar
        barStyle='light-content'
        backgroundColor='transparent'
        translucent
      />
      <View style={styles.pulseContainer}>
        <Text>Testdsfafasfsdafasfsadf</Text>
        <SvgXml
          xml={StateAtRisk}
          width={size ? size : 80}
          height={size ? size : 80}
        />
      </View>

      <View style={styles.mainContainer}>
        <View style={styles.contentAbovePulse}>
          <Typography style={styles.mainTextAbove}>
            {languages.t('label.home_at_risk_header')}
          </Typography>
          <Typography style={styles.subsubheaderText}>
            {languages.t('label.home_at_risk_subsubtext')}
          </Typography>
        </View>
        <View style={styles.contentBelowPulse}>
          <Typography style={styles.subheaderText}>
            {languages.t('label.home_at_risk_subtext')}
          </Typography>
          <View style={styles.buttonContainer}>
            <ButtonWrapper
              title={buttonLabel}
              onPress={() => {
                buttonFunction();
              }}
              buttonColor={Colors.BLUE_BUTTON}
              bgColor={Colors.WHITE}
            />
          </View>
        </View>
      </View>
      {MayoInfo()}
    </ImageBackground>
  );
};

export default ExposurePage;
