import React from 'react';
import { useTranslation } from 'react-i18next';
import { InfoText } from './components/InfoText';

/**
 * @typedef { import(".").SurveyQuestion } SurveyQuestion
 * @typedef { import(".").SurveyOption } SurveyOption
 */
// import i18n from '../../locales/languages';
// import {
//   OPTION_VALUE_AGREE,
//   OPTION_VALUE_DISAGREE,
//   QUESTION_KEY_AGREE,
//   SCREEN_TYPE_RADIO,
// } from './constants';
import { Info } from './Info';
import { Typography } from '../../components/Typography'; 
import { Colors } from '../../styles';
import { Icons } from '../../assets';

/** @type {React.FunctionComponent<{}>} */
export const Agreement = ({ navigation }) => {
  let { t } = useTranslation();
  return (
    <Info
      ctaAction={() => {
        navigation.push('EmergencyAssessment');
      }}
      backgroundColor={Colors.invertedQuaternaryBackground}
      ctaBackgroundColor={Colors.white}
      ctaTextColor={Colors.black}
      icon={Icons.SelfAssessment}
      ctaTitle={t('assessment.agreement_cta')}
      footer={<AgreementFooter  description={t('assessment.agreement_footer')} />}>
        <InfoText useTitleStyle='headline3'
          useDescriptionStyle='body4'
          title={t('assessment.agreement_title')}
          description={t('assessment.agreement_description')} />
    </Info>      
  );
};

const AgreementFooter = ({ description }) => (
  <Typography style={{paddingTop: 10}} use='body4'>
    {description}
  </Typography>
)

// /** @type {SurveyQuestion} */
// const agreeQuestion = {
//   option_key: QUESTION_KEY_AGREE,
//   question_description: i18n.t('assessment.agree_question_description'),
//   question_key: QUESTION_KEY_AGREE,
//   question_text: i18n.t('assessment.agree_question_text'),
//   question_type: 'END',
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
