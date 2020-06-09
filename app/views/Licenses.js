import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BackHandler,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import fontFamily from './../constants/fonts';
import { Images } from '../assets';
import { NavigationBarWrapper, Typography } from '../components';
import Colors from '../constants/colors';
import { Theme } from '../constants/themes';
import { useAssets } from '../TracingStrategyAssets';

const PRIVACY_POLICY_URL =
  'https://docs.google.com/document/d/17u0f8ni9S0D4w8RCUlMMqxAlXKJAd2oiYGP8NUwkINo/edit';

export const LicensesScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const { legalHeader } = useAssets();

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
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View>
          <Typography style={styles.heading} use='headline2'>
            {legalHeader}
          </Typography>
          <Typography style={styles.body} use='body1'>
            {t('label.legal_page_address')}
          </Typography>
          <Typography
            style={styles.hyperlink}
            onPress={() => {
              Linking.openURL('mailto:info@pathcheck.org');
            }}>
            {/* eslint-disable-next-line react-native/no-raw-text */}
            {'info@pathcheck.org'}
          </Typography>
          <Typography
            style={styles.hyperlink}
            onPress={() => {
              Linking.openURL('https://covidsafepaths.org/');
            }}>
            {/* eslint-disable-next-line react-native/no-raw-text */}
            {'covidsafepaths.org'}
          </Typography>
        </View>
      </ScrollView>

      <Theme use='charcoal'>
        <TouchableOpacity
          onPress={handleTermsOfUsePressed}
          style={styles.termsInfoRow}>
          <Typography
            use='body1'
            onPress={() => Linking.openURL(PRIVACY_POLICY_URL)}>
            {t('label.privacy_policy')}
          </Typography>
          <View style={styles.arrowContainer}>
            <Image source={Images.ForeArrow} />
          </View>
        </TouchableOpacity>
      </Theme>
    </NavigationBarWrapper>
  );
};

const styles = StyleSheet.create({
  body: {
    color: Colors.BLACK,
    marginBottom: 24,
  },
  contentContainer: {
    width: '100%',
    backgroundColor: Colors.INTRO_WHITE_BG,
    paddingHorizontal: 26,
    paddingVertical: 40,
  },
  heading: {
    color: Colors.BLACK,
    marginBottom: 12,
  },
  hyperlink: {
    color: Colors.VIOLET_TEXT,
    fontSize: 16,
    marginBottom: 12,
    fontFamily: fontFamily.primaryRegular,
    textDecorationLine: 'underline',
  },
  termsInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.VIOLET,
    paddingVertical: 25,
    paddingHorizontal: 15,
  },
  arrowContainer: {
    alignSelf: 'center',
    paddingRight: 20,
    paddingLeft: 20,
  },
});
