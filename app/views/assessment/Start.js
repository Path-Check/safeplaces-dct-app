import React from 'react';
import { useTranslation } from 'react-i18next';

import { Icons, Images } from '../../assets';
import Colors from '../../constants/colors';
/**
 * @typedef { import(".").SurveyQuestion } SurveyQuestion
 * @typedef { import(".").SurveyOption } SurveyOption
 */
import { Info } from './Info';
import survey from './survey.json';

/** @type {React.FunctionComponent<{}>} */
export const Start = ({ navigation }) => {
  let { t } = useTranslation();
  const question = survey.questions.find((q) => q.question_key === "1");
  const option = survey.options.find((o) => o.key === question.option_key);

  return (
    <Info
      ctaAction={() => {
        navigation.push('Question', {
          question,
          option
        });
      }}
      backgroundColor={Colors.SECONDARY_10}
      backgroundImage={Images.EmptyPathBackground}
      icon={Icons.SelfAssessment}
      ctaTitle={t('assessment.start_cta')}
      title={t('assessment.start_title')}
      description={t('assessment.start_description')}
    />
  );
};


