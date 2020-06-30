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

const FAQ = ({ navigation }) => {
  const { t, i18n } = useTranslation();

  const englishFAQ =
    'https://docs.google.com/document/d/15IARgC5qGILNB13coHQcMZusWXh4VlU83UhnUZjiCXc/edit';
  const spanishFAQ =
    'https://docs.google.com/document/d/1koy_baiJouSir-rEQJrqS8l0e7eMw9vKCiVz9RW6a3E/edit?usp=sharing';
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

  const removeGoogleHeader = `(function() {
    const header = document.getElementsByTagName("div");
    header[0].style.display="none";
  })()`;

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  });

  return (
    <NavigationBarWrapper
      title={t('label.faq_page_title')}
      onBackPress={backToMain}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={{ flex: 4 }}>
          <WebView
            injectedJavaScript={removeGoogleHeader}
            originWhitelist={['*']}
            source={{
              uri: i18n.language === 'es' ? spanishFAQ : englishFAQ,
            }}
            style={{
              marginTop: -70,
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
    paddingRight: 40,
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
