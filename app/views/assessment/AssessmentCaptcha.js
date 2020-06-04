import { useNavigationState } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import image from '../../assets/images/assessment/illustration-screening-data-sharing.png';
import { Typography } from '../../components/Typography';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import { HCaptcha } from '../../services/CaptchaService';
import AssessmentButton from './AssessmentButton';
import { AnswersContext, SurveyContext } from './AssessmentContext';
import { CAPTCHA_URL, SURVEY_POST_API } from './constants';
import { Colors as AssessmentColors } from './constants';

const WIDTH = Dimensions.get('window').width;
const CONTAINER_WIDTH = 300 / 375;
const HEIGHT = WIDTH * CONTAINER_WIDTH;

/** @type {React.FunctionComponent<{}>} */
const AssessmentCaptcha = ({ navigation }) => {
  let { t } = useTranslation();
  const survey = useContext(SurveyContext);
  const answers = useContext(AnswersContext);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigationStateRoutes = useNavigationState(state => state.routes);
  const buttonDisabled = token === null || isLoading;
  const captchaEventMessage = ['cancel', 'error', 'expired'];

  const handleOnMessage = event => {
    if (event && event.nativeEvent.data) {
      if (captchaEventMessage.includes(event.nativeEvent.data)) {
        // TODO: Better error handling
        Alert.alert('Captcha Response', `captcha ${event.nativeEvent.data}`, [
          {
            text: 'OK',
          },
        ]);
      } else {
        setToken(event.nativeEvent.data);
      }
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const questionKeys = survey.questions.map(q => q.question_key);
    // Extract the keys from navigation stack because the user might
    // have answered a question, pressed back, changed answer, ended up on a different question
    // rendering that answer no longer valid
    const questionKeysFinal = navigationStateRoutes
      .filter(r => r.params && r.params.question)
      .map(r => r.params.question.question_key)
      // Remove injected questions (agreement, etc)
      .filter(k => questionKeys.includes(k));
    const response = questionKeysFinal.map(question_key => ({
      question_key,
      response: answers[question_key].map(r => r.value),
    }));
    // TODO: Loading state / disable button
    try {
      const res = await fetch(SURVEY_POST_API, {
        body: JSON.stringify(response),
        headers: {
          Accept: 'application/json; charset=utf-8',
          Authorization: `Basic ${token}`,
          'Content-Type': 'application/json; charset=utf-8',
        },
        method: 'POST',
      });
      const payload = await res.json();
      console.log(payload);
      navigation.replace('EndComplete');
    } catch (error) {
      console.error(`Survey post Failed, ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Image
          reiszeMode='cover'
          source={image}
          style={{ width: WIDTH, height: HEIGHT }}
        />
        <Typography bold style={styles.title}>
          {t('assessment.captcha_title')}
        </Typography>
        <Typography style={styles.description}>
          {t('assessment.captcha_description')}
        </Typography>
        <HCaptcha
          style={styles.captcha}
          uri={CAPTCHA_URL}
          onMessage={handleOnMessage}
        />
      </ScrollView>
      <View style={styles.footer}>
        <AssessmentButton
          disabled={buttonDisabled}
          onPress={handleSubmit}
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
    backgroundColor: AssessmentColors.BACKGROUND,
  },
  scrollView: {
    flex: 1,
  },
  title: {
    fontFamily: Fonts.primaryBold,
    fontSize: 28,
    color: Colors.BLACK,
    marginBottom: 10,
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  description: {
    fontFamily: Fonts.primaryRegular,
    fontSize: 18,
    color: Colors.BLACK,
    lineHeight: 24,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  captcha: {
    minHeight: 600,
    backgroundColor: AssessmentColors.TRANSPARENT,
  },
  footer: {
    padding: 20,
  },
});
