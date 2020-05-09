import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, ImageBackground, StatusBar, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import backgroundImage from './../../assets/images/launchScreenBackground.png';
import StateAtRisk from '../../assets/svgs/stateAtRisk';
import { Button } from '../../components/Button';
import { Typography } from '../../components/Typography';
import { Theme } from '../../constants/themes';
import { MayoButton } from './MayoButton';
import { styles } from './style';

export const ExposurePage = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const buttonLabel = t('label.see_exposure_history');
  const size = Dimensions.get('window').height;

  return (
    <Theme use='charcoal'>
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
              <Button
                label={buttonLabel}
                onPress={() => navigation.navigate('ExposureHistoryScreen')}
                style={styles.buttonContainer}
              />
            </View>
          </View>
        </View>
        <MayoButton />
      </ImageBackground>
    </Theme>
  );
};
