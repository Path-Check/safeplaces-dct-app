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
import StateUnknown from '../../assets/svgs/stateUnknown';
import ButtonWrapper from '../../components/ButtonWrapper';
import { Typography } from '../../components/Typography';
import Colors from '../../constants/colors';
import { MayoButton } from './MayoButton';
import { styles } from './style';

export const OffPage = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const buttonLabel = t('label.home_enable_location');
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
          xml={StateUnknown}
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
            {t('label.home_setting_off_subtext')}
          </Typography>
          <View style={styles.buttonContainer}>
            <ButtonWrapper
              title={buttonLabel}
              onPress={() => {
                navigation.navigate('SettingsScreen', {});
              }}
              buttonColor={Colors.BLUE_BUTTON}
              bgColor={Colors.WHITE}
            />
          </View>
        </View>
      </View>
      <MayoButton />
    </ImageBackground>
  );
};
