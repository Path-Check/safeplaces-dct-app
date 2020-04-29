import React from 'react';
import { Image, Linking, TouchableOpacity, View } from 'react-native';

import foreArrow from './../../assets/images/foreArrow.png';
import { Typography } from './../../components/Typography';
import languages from '../../locales/languages';
import styles from './style';

const MAYO_COVID_URL = 'https://www.mayoclinic.org/coronavirus-covid-19';

const Press = () => Linking.openURL(MAYO_COVID_URL);
const MayoInfo = () => {
  return (
    <View>
      <TouchableOpacity onPress={Press} style={styles.mayoInfoRow}>
        <View style={styles.mayoInfoContainer}>
          <Typography style={styles.mainMayoHeader} onPress={Press}>
            {languages.t('label.home_mayo_link_heading')}
          </Typography>
          <Typography style={styles.mainMayoSubtext} onPress={Press}>
            {languages.t('label.home_mayo_link_label')}
          </Typography>
        </View>
        <View style={styles.arrowContainer}>
          <Image source={foreArrow} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default MayoInfo;
