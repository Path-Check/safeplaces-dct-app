import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { CATCHA_URL } from '../../constants/apis';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import HCaptcha from '../../services/CaptchaService';
import AssessmentButton from './AssessmentButton';

/** @type {React.FunctionComponent<{}>} */
const WIDTH = Dimensions.get('window').width;
const HEIGHT = 40;

const AssessmentCaptcha = () => {
  let { t } = useTranslation();

  return (
    <SafeAreaView style={styles.container}>
      <Image
        reiszeMode='cover'
        source={require('../../assets/images/illustration-screening-data-sharing.png')}
        style={{ width: WIDTH, height: HEIGHT }}
      />
      <Text style={styles.title}>{t('assessment.captcha_title')}</Text>
      <Text style={styles.description}>
        {t('assessment.captcha_description')}
      </Text>

      <HCaptcha
        uri={CATCHA_URL}
        onMessage={event => {
          if (event && event.nativeEvent.data) {
            if (
              ['cancel', 'error', 'expired'].includes(event.nativeEvent.data)
            ) {
              console.log('Verified code failed');
              Alert.alert(
                'Captcha Response',
                `captcha ${event.nativeEvent.data}`,
                [
                  {
                    text: 'OK',
                  },
                ],
              );
            } else {
              console.log('Verified code received', event.nativeEvent.data);
              Alert.alert('Captcha Response', 'response received', [
                {
                  text: 'OK',
                },
              ]);
            }
          }
        }}
      />

      <View style={styles.footer}>
        <AssessmentButton
          onPress={() => {}}
          title={t('assessment.captcha_cta')}
        />
      </View>
    </SafeAreaView>
  );
};

export default AssessmentCaptcha;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.ASSESSMENT_BACKGROUND,
  },
  title: {
    fontFamily: Fonts.primaryBold,
    fontSize: 30,
    marginBottom: 10,
    marginTop: 10,
    paddingHorizontal: 20,
  },
  description: {
    fontFamily: Fonts.primaryRegular,
    fontSize: 18,
    lineHeight: 24,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  footer: {
    padding: 20,
  },
});
