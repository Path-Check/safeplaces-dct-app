import axios from 'axios';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { CATCHA_URL, SURVEY_POST_API } from '../../constants/apis';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import HCaptcha from '../../services/CaptchaService';
import AssessmentButton from './AssessmentButton';
import { AnswersContext, SurveyContext } from './AssessmentContext';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = WIDTH * (300 / 375);

/** @type {React.FunctionComponent<{}>} */
const AssessmentCaptcha = ({ navigation }) => {
  let { t } = useTranslation();
  const survey = useContext(SurveyContext);
  const answers = useContext(AnswersContext);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const buttonDisabled = token === null || isLoading;
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
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
          style={styles.captcha}
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
                setToken(event.nativeEvent.data);
              }
            }
          }}
        />
      </ScrollView>
      <View style={styles.footer}>
        <AssessmentButton
          disabled={buttonDisabled}
          onPress={() => {
            setIsLoading(true);
            const state = navigation.dangerouslyGetState();
            const questionKeys = survey.questions.map(q => q.question_key);
            // Extract the keys from navigation stack because the user might
            // have answered a question, pressed back, changed answer, ended up on a different question
            // rendering that answer no longer valid
            const questionKeysFinal = state.routes
              .filter(r => r.params && r.params.question)
              .map(r => r.params.question.question_key)
              // Remove injected questions (agreement, etc)
              .filter(k => questionKeys.includes(k));
            const response = questionKeysFinal.map(question_key => ({
              question_key,
              response: answers[question_key].map(r => r.value),
            }));
            // TODO: Loading state / disable button
            axios
              .post(SURVEY_POST_API, response, {
                headers: { Authorization: 'Basic ' + token },
              })
              .then(response => {
                console.log(`Survey post succeeded: ${response}`);
                navigation.replace('EndComplete');
              })
              .catch(error => {
                console.error(`Survey post Failed, ${error}`);
                setIsLoading(false);
              });
          }}
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
  scrollView: {
    flex: 1,
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
  captcha: {
    minHeight: 600,
  },
  footer: {
    padding: 20,
  },
});
