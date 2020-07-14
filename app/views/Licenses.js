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

import foreArrow from './../assets/images/foreArrow.png';
import englishLicense from './../assets/LICENSE.json';
import spanishLicense from './../assets/SPANISH_LICENSE.json';
import NavigationBarWrapper from '../components/NavigationBarWrapper';
import { Typography } from '../components/Typography';
import Colors from '../constants/colors';
import { Theme } from '../constants/themes';

const PRIVACY_POLICY_URL =
  'https://docs.google.com/document/d/17u0f8ni9S0D4w8RCUlMMqxAlXKJAd2oiYGP8NUwkINo/edit';

const PRIVACY_POLICY_URL_ES =
  'https://docs.google.com/document/d/1znFbxn02pqVFFR9EDQh7jc28qBjWWI-MH7G50EFxEgs/edit';

export const LicensesScreen = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const urlPrivacyPolicy =
    i18n.language === 'es' ? PRIVACY_POLICY_URL_ES : PRIVACY_POLICY_URL;

  const backToMain = () => {
    navigation.goBack();
  };

  const handleBackPress = () => {
    backToMain();
    return true;
  };

  const handleTermsOfUsePressed = () => {
    Linking.openURL(urlPrivacyPolicy);
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  });

  function getLicenses(license) {
    let result = '<html>';
    result +=
      '<style>  html, body { font-size: 40px; margin: 0; padding: 0; } </style>';
    result += '<body>';

    for (let i = 0; i < license.terms_and_licenses.length; i++) {
      const element = license.terms_and_licenses[i];

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
        <View style={{ flex: 1 }}>
          <WebView
            originWhitelist={['*']}
            source={{
              html: getLicenses(
                i18n.language === 'es' ? spanishLicense : englishLicense,
              ),
            }}
            style={{
              marginTop: 15,
              backgroundColor: Colors.WHITE,
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
            onPress={() => Linking.openURL(urlPrivacyPolicy)}>
            {t('label.privacy_policy')}
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
  contentContainer: {
    flexDirection: 'column',
    width: '100%',
    backgroundColor: Colors.WHITE,
    paddingHorizontal: 26,
    flex: 1,
  },
  termsInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.GRAY_BUTTON,
    padding: 7,
  },
  arrowContainer: {
    alignSelf: 'center',
    paddingRight: 20,
    paddingLeft: 20,
  },
});
