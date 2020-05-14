/* eslint-disable react-native/no-raw-text */
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BackHandler,
  Image,
  Linking,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import foreArrow from './../assets/images/foreArrow.png';
import fontFamily from './../constants/fonts';
import NavigationBarWrapper from '../components/NavigationBarWrapper';
import { Typography } from '../components/Typography';
import Colors from '../constants/colors';
import { Theme } from '../constants/themes';

const PRIVACY_POLICY_URL = 'http://covidsafepaths.org/privacy';

export const LicensesScreen = ({ navigation }) => {
  const { t } = useTranslation();

  const backToMain = () => {
    navigation.goBack();
  };

  const handleBackPress = () => {
    backToMain();
    return true;
  };

  const handleTermsOfUsePressed = () => {
    Linking.openURL(PRIVACY_POLICY_URL);
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  });

  return (
    <NavigationBarWrapper
      title={t('label.legal_page_title')}
      onBackPress={backToMain}>
      <Theme use='default'>
        <View style={styles.legalInfo}>
          <Typography use='headline2' style={styles.section}>
            {t('label.covid_safe_paths')}
          </Typography>

          <View style={styles.section}>
            <Typography use='body2'>Path Check</Typography>
            <Typography use='body2'>58 Day Street</Typography>
            <Typography use='body2'>Box 441621</Typography>
            <Typography use='body2'>Somerville, MA 02144</Typography>
          </View>

          <View style={styles.section}>
            <Typography use='body1' style={styles.hyperlink}>
              info@pathcheck.org
            </Typography>
            <Typography use='body1' style={styles.hyperlink}>
              covidsafepaths.org
            </Typography>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleTermsOfUsePressed}
          style={styles.termsInfoRow}>
          <Typography
            use='headline2'
            onPress={() => Linking.openURL(PRIVACY_POLICY_URL)}
            style={styles.privacyPolicy}>
            {t('label.terms_of_use')}
          </Typography>
          <View style={styles.arrowContainer}>
            <Image source={foreArrow} />
          </View>
        </TouchableOpacity>
      </Theme>
    </NavigationBarWrapper>
  );
};

const styles = StyleSheet.create({
  termsInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.VIOLET,
    padding: 15,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  arrowContainer: {
    alignSelf: 'center',
    paddingRight: 20,
    paddingLeft: 20,
  },
  hyperlink: {
    color: Colors.BLUE_LINK,
    fontSize: 16,
    lineHeight: 22.5,
    fontFamily: fontFamily.primaryRegular,
    textDecorationLine: 'underline',
  },
  legalInfo: {
    marginTop: 10,
    marginLeft: 20,
  },
  section: {
    marginVertical: 10,
  },
  privacyPolicy: {
    color: Colors.WHITE,
  },
});
