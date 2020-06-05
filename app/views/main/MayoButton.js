import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Linking, TouchableOpacity, View } from 'react-native';

import { Images } from '../../assets';
import { Typography } from '../../components';
import { styles } from './style';

const MAYO_COVID_URL = 'https://www.mayoclinic.org/coronavirus-covid-19';

export const MayoButton = () => {
  const { t, i18n } = useTranslation();
  const onPress = () => Linking.openURL(MAYO_COVID_URL);

  /**
   * Currently, the component is only enabled in English. This will
   * be updated once there are language-specific resources to link to.
   */
  const isEnabled = i18n.language === 'en';

  return (
    isEnabled && (
      <View>
        <TouchableOpacity onPress={onPress} style={styles.mayoInfoRow}>
          <View style={styles.mayoInfoContainer}>
            <Typography
              style={styles.mainMayoHeader}
              onPress={onPress}
              testID='MayoLinkHeading'>
              {t('label.home_mayo_link_heading')}
            </Typography>
            <Typography
              style={styles.mainMayoSubtext}
              onPress={onPress}
              testID='MayoLinkLabel'>
              {t('label.home_mayo_link_label')}
            </Typography>
          </View>
          <View style={styles.arrowContainer}>
            <Image source={Images.ForeArrow} />
          </View>
        </TouchableOpacity>
      </View>
    )
  );
};
