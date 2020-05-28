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

import { Icons, Images } from '../../assets';
import { Button } from '../../components/Button';
import { Typography } from '../../components/Typography';
import { Theme } from '../../constants/themes';
import { MayoButton } from './MayoButton';
import { styles } from './style';
import { AppSpecificAssets } from '../../TracingStrategyAssets';

export const OffPage = () => {
  const { t } = useTranslation();
  const { offPageCta, offPageButton } = AppSpecificAssets();
  const navigation = useNavigation();
  const size = Dimensions.get('window').height;

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
          <SvgXml
            xml={Icons.StateUnknown}
            width={size ? size : 80}
            height={size ? size : 80}
          />
        </View>

        <View style={styles.mainContainer}>
          <View style={styles.contentAbovePulse}>
            <Typography style={styles.mainTextAbove} />
            <Typography style={styles.subsubheaderText} />
          </View>
          <View style={styles.contentBelowPulse}>
            <Text style={styles.mainTextBelow}>
              {t('label.home_setting_off_header')}
            </Text>
            <Typography style={styles.subheaderText}>
              {offPageCta}
            </Typography>
            <Button
              label={offPageButton}
              onPress={() => navigation.navigate('SettingsScreen', {})}
              style={styles.buttonContainer}
            />
          </View>
        </View>
        <MayoButton />
      </ImageBackground>
    </Theme>
  );
};
