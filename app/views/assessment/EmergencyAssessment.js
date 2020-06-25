import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Button } from './Button';
import { Typography } from '../../components/Typography';

/**
 * @typedef { import(".").SurveyQuestion } SurveyQuestion
 * @typedef { import(".").SurveyOption } SurveyOption
 */
import i18n from '../../locales/languages';
import {
  OPTION_VALUE_AGREE,
  OPTION_VALUE_DISAGREE,
  QUESTION_KEY_AGREE,
  SCREEN_TYPE_RADIO,
  SCREEN_TYPE_EMERGENCY
} from './constants';
import { useSurvey } from '../../helpers/CustomHooks';
import { Info } from './Info';
// import { Typography } from '../../components/Typography'; 
import { Colors } from '../../styles';

/** @type {React.FunctionComponent<{}>} */
export const EmergencyAssessment = ({ navigation }) => {
  const { t } = useTranslation();
  const survey = useSurvey();

  console.log(survey)

  const handleAgreePress = () => {
    navigation.push(SCREEN_TYPE_EMERGENCY);
  }

  const handleDisagreePress = () => {
    navigation.push('AssessmentQuestion', {
      question: agreeQuestion,
      option: agreeOption,
    });
  }

  return (
    <Info
      ctaAction={() => {
        navigation.push('AssessmentQuestion', {
          question: agreeQuestion,
          option: agreeOption,
        });
      }}
      backgroundColor={Colors.surveyPrimaryBackground}
      title={t('assessment.agree_question_text')}
      description={t('assessment.agree_question_description')}
      footer={
        <ChoiceButtons agreePress={handleAgreePress}
          agreeTitle={
            <Trans t={t} i18nKey={'assessment.agree_option_agree'}>
              <Typography />
              <Typography style={{fontWeight: 'bold'}} />
            </Trans>
          }
          disagreePress={handleDisagreePress}
          disagreeTitle={
            <Trans t={t} i18nKey={'assessment.agree_option_disagree'}>
              <Typography />
              <Typography style={{fontWeight: 'bold'}} />
            </Trans>
          } />
      }
    />
  );
};

const ChoiceButtons = ({agreeTitle, disagreeTitle, agreePress, disagreePress}) => {
  return (
    <View>
      <Button textStyle={{textAlign: 'left', paddingHorizontal: 30}}
        buttonStyle={{borderWidth: 1, borderColor: Colors.steelGray}}
        onPress={agreePress}
        title={agreeTitle}
        backgroundColor={Colors.white}
        textColor={Colors.black} />
      <View style={{paddingTop: 10}}>
        <Button textStyle={{textAlign: 'left', paddingHorizontal: 30}}
          buttonStyle={{borderWidth: 1, borderColor: Colors.steelGray}}
          onPress={disagreePress}
          title={disagreeTitle}
          backgroundColor={Colors.white}
          textColor={Colors.black} />
      </View>
    </View>
  )
}

/** @type {SurveyQuestion} */
const agreeQuestion = {
  option_key: QUESTION_KEY_AGREE,
  //question_description: 'How old are you',
  question_key: QUESTION_KEY_AGREE,
  question_text: 'How are you?',
  question_type: 'RADIO',
  required: true,
  screen_type: SCREEN_TYPE_RADIO,
};

/** @type {SurveyOption} */
const agreeOption = {
  key: QUESTION_KEY_AGREE,
  values: [
    {
      label: 'Excellent!',
      value: OPTION_VALUE_AGREE,
    },
    {
      label: 'Pretty good!',
      value: OPTION_VALUE_DISAGREE,
    },
  ],
};
