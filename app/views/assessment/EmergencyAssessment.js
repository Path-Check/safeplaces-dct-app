import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Button } from './Button';
import { Typography } from '../../components/Typography';

/**
 * @typedef { import(".").SurveyQuestion } SurveyQuestion
 * @typedef { import(".").SurveyOption } SurveyOption
 */
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
import { InfoText } from './components/InfoText';

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
      backgroundColor={Colors.surveyPrimaryBackground}
      footer={
        <ChoiceButtons agreePress={handleAgreePress}
          agreeTitle={<TranslationButtonText translator={t} text={'assessment.agree_option_agree'} />}
          disagreePress={handleDisagreePress}
          disagreeTitle={<TranslationButtonText translator={t} text={'assessment.agree_option_disagree'} />}
        />
      }>
        <InfoText useTitleStyle='headline2'
          title={t('assessment.agree_question_text')}
          description={t('assessment.agree_question_description')} />
    </Info>    
  );
};

//TODO: we should map these for like multi choices and stuff
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

const TranslationButtonText = ({ translator, text }) => (
  <Trans t={translator} i18nKey={text}>
    <Typography />
    <Typography style={{fontWeight: 'bold'}} />
  </Trans>
)

/** @type {SurveyQuestion} */
const agreeQuestion = {
  option_key: QUESTION_KEY_AGREE,
  //question_description: 'How old are you',
  question_key: QUESTION_KEY_AGREE,
  question_text: 'Placeholder question',
  question_type: 'RADIO',
  required: true,
  screen_type: SCREEN_TYPE_RADIO,
};

/** @type {SurveyOption} */
const agreeOption = {
  key: QUESTION_KEY_AGREE,
  values: [
    {
      label: 'Proceed',
      value: OPTION_VALUE_AGREE,
    },
    {
      label: 'Stop here',
      value: OPTION_VALUE_DISAGREE,
    },
  ],
};
