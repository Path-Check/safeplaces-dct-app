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
import { WebView } from 'react-native-webview';

import { Images } from '../assets';
import licenses from '../assets/LICENSE.json';
import NavigationBarWrapper from '../components/NavigationBarWrapper';
import { Typography } from '../components/Typography';
import Colors from '../constants/colors';
import { Theme } from '../constants/themes';

const PRIVACY_POLICY_URL =
  'https://docs.google.com/document/d/17u0f8ni9S0D4w8RCUlMMqxAlXKJAd2oiYGP8NUwkINo/edit';

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

  function getLicenses() {
    let result = '<html>';
    result +=
      '<style>  html, body { font-size: 40px; margin: 0; padding: 0; } </style>';
    result += '<body>';

    for (let i = 0; i < licenses.terms_and_licenses.length; i++) {
      const element = licenses.terms_and_licenses[i];

      result += '<H2>' + element.name + '</H2><P>';
      result += element.text.replace(/\n/g, '<br/>');
      result += '<hr/>';
    }
    result += '</body></html>';

    return result;
  }

  return (
    <NavigationBarWrapper
      title={t('label.legal_page_title')}
      onBackPress={backToMain}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={{ flex: 4 }}>
          <WebView
            originWhitelist={['*']}
            source={{
              html: getLicenses(),
            }}
            style={{
              marginTop: 15,
              backgroundColor: Colors.INTRO_WHITE_BG,
            }}
          />
        </View>
      </ScrollView>
      <Theme use='charcoal'>
        <TouchableOpacity
          onPress={handleTermsOfUsePressed}
          style={styles.termsInfoRow}>
          <Typography
            use='headline2'
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
  contentContainer: {
    flexDirection: 'column',
    width: '100%',
    backgroundColor: Colors.INTRO_WHITE_BG,
    paddingHorizontal: 26,
    flex: 1,
  },
  termsInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.SILVER,
    padding: 15,
  },
  arrowContainer: {
    alignSelf: 'center',
    paddingRight: 20,
    paddingLeft: 20,
  },
});
