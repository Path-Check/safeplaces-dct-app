import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Image, Text, View } from 'react-native';

import Fonts from '../../constants/fonts';
import i18n from '../../locales/languages';
import AssessmentEnd from './AssessmentEnd';
import {
  OPTION_VALUE_AGREE,
  OPTION_VALUE_DISAGREE,
  QUESTION_KEY_AGREE,
  SCREEN_TYPE_RADIO,
} from './constants';

/**
 * @typedef { import("./Assessment").SurveyQuestion } SurveyQuestion
 * @typedef { import("./Assessment").SurveyOption } SurveyOption
 */

/** @type {React.FunctionComponent<{}>} */
const AssessmentStart = ({ navigation }) => {
  let { t } = useTranslation();
  return (
    <AssessmentEnd
      ctaAction={() => {
        navigation.push('Question', {
          question: agreeQuestion,
          option: agreeOption,
        });
      }}
      ctaTitle={t('assessment.start_cta')}
      description={
        <Trans i18nKey='assessment.start_description'>
          <Text />
          <Text style={{ fontFamily: Fonts.primaryBold }} />
          <Text style={{ fontFamily: Fonts.primaryBold }} />
        </Trans>
      }
      image={require('../../assets/images/illustration-screening-start.png')}
      pretitle={
        <View
          style={{
            alignItems: 'flex-end',
            flexDirection: 'row',
            marginBottom: 10,
          }}>
          <Image
            source={require('../../assets/images/logo-cdc.png')}
            style={{ width: 47, height: 29, marginRight: 10 }}
          />
          <Image
            source={require('../../assets/images/logo-mit-media-lab.png')}
            style={{ width: 58, height: 32 }}
          />
        </View>
      }
      title={t('assessment.start_title')}
    />
  );
};

/** @type {SurveyQuestion} */
const agreeQuestion = {
  option_key: QUESTION_KEY_AGREE,
  question_description: i18n.t('assessment.agree_question_description'),
  question_key: QUESTION_KEY_AGREE,
  question_text: i18n.t('assessment.agree_question_text'),
  question_type: 'TEXT',
  required: true,
  screen_type: SCREEN_TYPE_RADIO,
};

/** @type {SurveyOption} */
const agreeOption = {
  key: QUESTION_KEY_AGREE,
  values: [
    {
      label: i18n.t('assessment.agree_option_agree'),
      value: OPTION_VALUE_AGREE,
    },
    {
      label: i18n.t('assessment.agree_option_disagree'),
      value: OPTION_VALUE_DISAGREE,
    },
  ],
};

export default AssessmentStart;
