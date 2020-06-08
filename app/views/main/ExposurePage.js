import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, ImageBackground, StatusBar, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { Icons, Images } from '../../assets';
import { Button, Typography } from '../../components';
import { Theme } from '../../constants/themes';
import { useAssets } from '../../TracingStrategyAssets';
import { MayoButton } from './MayoButton';
import { styles } from './style';

export const ExposurePage = () => {
  const { t } = useTranslation();
  const { exposurePageSubheader } = useAssets();
  const navigation = useNavigation();
  const buttonLabel = t('label.see_exposure_history');
  const size = Dimensions.get('window').height;

  return (
    <Theme use='charcoal'>
      <ImageBackground
        source={Images.BackgroundAtRisk}
        style={styles.backgroundImage}>
        <StatusBar
          barStyle='light-content'
          backgroundColor='transparent'
          translucent
        />
        <View style={styles.pulseContainer}>
          <SvgXml
            xml={Icons.StateAtRisk}
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
              {exposurePageSubheader}
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
