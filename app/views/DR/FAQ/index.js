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

import foreArrow from '../../../assets/images/foreArrow.png';
import NavigationBarWrapper from '../../../components/NavigationBarWrapper';
import { Typography } from '../../../components/Typography';
import Colors from '../../../constants/colors';
import { Theme } from '../../../constants/themes';
import englishFAQ from '../../../locales/faqs/en.json';
import spanishFAQ from '../../../locales/faqs/es.json';

const FAQ = ({ navigation }) => {
  const { t, i18n } = useTranslation();

  const HEALTH_MINISTRY_URL =
    'http://digepisalud.gob.do/documentos/?drawer=Vigilancia%20Epidemiologica*Alertas%20epidemiologicas*Coronavirus*Nacional*Materiales%20IEC%20COVID-19';

  const backToMain = () => {
    navigation.goBack();
  };

  const handleBackPress = () => {
    backToMain();
    return true;
  };

  const handleTermsOfUsePressed = () => {
    Linking.openURL(HEALTH_MINISTRY_URL);
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  });

  function getFAQS(faqs) {
    let result = '<html>';
    result +=
      '<style>  html, body { font-size: 40px; margin: 0; padding: 0; } </style>';
    result += '<body>';

    for (let i = 0; i < faqs.faqs.length; i++) {
      const element = faqs.faqs[i];

      result += '<H2>' + element.name + '</H2><P>';
      result += element.text.replace(/\n/g, '<br/>');
      result += '<hr/>';
    }
    result += '</body></html>';

    return result;
  }

  return (
    <NavigationBarWrapper
      title={t('label.faq_page_title')}
      onBackPress={backToMain}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={{ flex: 4 }}>
          <WebView
            originWhitelist={['*']}
            source={{
              html: getFAQS(i18n.language === 'es' ? spanishFAQ : englishFAQ),
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
            onPress={() => Linking.openURL(HEALTH_MINISTRY_URL)}>
            {t('label.health_resources')}
          </Typography>
          <View style={styles.arrowContainer}>
            <Image source={foreArrow} />
          </View>
        </TouchableOpacity>
      </Theme>
    </NavigationBarWrapper>
  );
};

export default FAQ;

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
    backgroundColor: Colors.GRAY_BUTTON,
    padding: 7,
  },
  arrowContainer: {
    alignSelf: 'center',
    paddingRight: 20,
    paddingLeft: 20,
  },
});
