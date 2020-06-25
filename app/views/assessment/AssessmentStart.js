import React from 'react';
import { useTranslation } from 'react-i18next';

// /**
//  * @typedef { import(".").SurveyQuestion } SurveyQuestion
//  * @typedef { import(".").SurveyOption } SurveyOption
//  */
// import i18n from '../../locales/languages';
// import {
//   OPTION_VALUE_AGREE,
//   OPTION_VALUE_DISAGREE,
//   QUESTION_KEY_AGREE,
//   SCREEN_TYPE_RADIO,
// } from './constants';
import { Info } from './Info';

import { Colors } from '../../styles';
import { Icons, Images } from '../../assets';

/** @type {React.FunctionComponent<{}>} */
export const AssessmentStart = ({ navigation }) => {
  let { t } = useTranslation();
  return (
    <Info
      ctaAction={() => {
        navigation.push('Agreement');
      }}
      backgroundColor={Colors.surveyPrimaryBackground}
      backgroundImage={Images.EmptyPathBackground}
      icon={Icons.SelfAssessment}
      ctaTitle={t('assessment.start_cta')}
      title={t('assessment.start_title')}
      description={t('assessment.start_description')}
    />
  );
};

// /** @type {SurveyQuestion} */
// const agreeQuestion = {
//   option_key: QUESTION_KEY_AGREE,
//   question_description: i18n.t('assessment.agree_question_description'),
//   question_key: QUESTION_KEY_AGREE,
//   question_text: i18n.t('assessment.agree_question_text'),
//   question_type: 'TEXT',
//   required: true,
//   screen_type: SCREEN_TYPE_RADIO,
// };

// /** @type {SurveyOption} */
// const agreeOption = {
//   key: QUESTION_KEY_AGREE,
//   values: [
//     {
//       label: i18n.t('assessment.agree_option_agree'),
//       value: OPTION_VALUE_AGREE,
//     },
//     {
//       label: i18n.t('assessment.agree_option_disagree'),
//       value: OPTION_VALUE_DISAGREE,
//     },
//   ],
// };
