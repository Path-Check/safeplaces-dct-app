import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dimensions,
  ImageBackground,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { openSettings } from 'react-native-permissions';
import { SvgXml } from 'react-native-svg';

import { Icons, Images } from '../../assets';
import { Button, Typography } from '../../components';
import { Theme } from '../../constants/themes';
import { MayoButton } from './MayoButton';
import { styles } from './style';

export const UnknownPage = () => {
  const { t } = useTranslation();
  const buttonLabel = t('label.home_enable_location');
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
              {t('label.home_unknown_header')}
            </Text>
            <Typography style={styles.subheaderText}>
              {t('label.home_unknown_subtext')}
            </Typography>
            <View style={styles.buttonContainer}>
              <Button
                label={buttonLabel}
                onPress={openSettings}
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
