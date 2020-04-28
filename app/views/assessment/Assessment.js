import { CardStyleInterpolators } from '@react-navigation/stack';
import React, { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Button, Text, TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

import Colors from '../../constants/colors';
import i18n from '../../locales/languages';
import { isPlatformiOS } from '../../Util';
import AssessmentCaptcha from './AssessmentCaptcha';
import AssessmentEndCaregiver from './AssessmentEndCaregiver';
import AssessmentEndDistancing from './AssessmentEndDistancing';
import AssessmentEndEmergency from './AssessmentEndEmergency';
import AssessmentEndIsolate from './AssessmentEndIsolate';
import AssessmentEndShare from './AssessmentEndShare';
import AssessmentQuestion from './AssessmentQuestion';

/**
 * @typedef {"CHECKBOX" | "RADIO" | "END_CAREGIVER" | "END_DISTANCING" | "END_EMERGENCY" | "END_ISOLATE" } SurveyScreen
 *
 * @typedef {{
 *   options: SurveyOption[]
 *   questions: SurveyQuestion[],
 *   screen_types: SurveyScreen[]
 * }} Survey
 *
 * @typedef {{
 *   conditions?: [{ response: string; value: string; }]
 *   id: string;
 *   image?: string;
 *   index: number;
 *   option_key: string;
 *   question_description?: string;
 *   question_key: string;
 *   question_text: string;
 *   question_type: "DATE" | "END" | "MULTI" | "TEXT";
 *   required: boolean;
 *   screen_type: SurveyScreen
 * }} SurveyQuestion
 *
 * @typedef {{
 *   key: string;
 *   values: [{ description?: string; label: string; value: string; }]
 * }} SurveyOption
 *
 * @typedef {{ [key: string]: { index: number, value: string }[] }} SurveyAnswers
 */

const Stack = createNativeStackNavigator();

const Assessment = ({ navigation }) => {
  const { t } = useTranslation();
  /** @type {React.MutableRefObject<SurveyAnswers>} */
  const answers = useRef({});
  const [survey] = useState(createSurvey);
  const QuestionScreen = useMemo(
    () => ({ navigation, route }) => (
      <AssessmentQuestion
        {...route.params}
        onNext={() => {
          onNextQuestion({ answers, navigation, route, survey });
        }}
        onChange={value => {
          let { question } = route.params;
          answers.current[question.id] = value;
        }}
      />
    ),
    [answers, survey],
  );
  const screenOptions = {
    headerBackTitle: 'Back',
    headerHideShadow: true,
    headerTitle: '',
    headerStyle: {
      backgroundColor: Colors.ASSESSMENT_BACKGROUND,
    },
    // eslint-disable-next-line
    headerRight: () =>
      isPlatformiOS() ? (
        <Button onPress={navigation.goBack} title={t('assessment.cancel')} />
      ) : (
        <TouchableOpacity onPress={navigation.goBack}>
          <Text>{t('assessment.cancel')}</Text>
        </TouchableOpacity>
      ),
  };
  return (
    <Stack.Navigator
      initialRouteName='Question'
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        cardStyle: {
          backgroundColor: 'transparent',
        },
      }}>
      <Stack.Screen
        component={QuestionScreen}
        initialParams={{
          answers: answers.current,
          question: agreeQuestion,
          option: agreeOption,
        }}
        name='Question'
        options={screenOptions}
      />
      <Stack.Screen
        component={AssessmentEndCaregiver}
        name='END_CAREGIVER'
        options={{
          ...screenOptions,
          headerStyle: {
            backgroundColor: Colors.ASSESSMENT_IMAGE_BACKGROUND,
          },
        }}
      />
      <Stack.Screen
        component={AssessmentEndDistancing}
        name='END_DISTANCING'
        options={{
          ...screenOptions,
          headerStyle: {
            backgroundColor: Colors.ASSESSMENT_IMAGE_BACKGROUND,
          },
        }}
      />
      <Stack.Screen
        component={AssessmentEndEmergency}
        name='END_EMERGENCY'
        options={{
          ...screenOptions,
          headerStyle: {
            backgroundColor: Colors.ASSESSMENT_IMAGE_BACKGROUND_DANGER,
          },
        }}
      />
      <Stack.Screen
        component={AssessmentEndIsolate}
        name='END_ISOLATE'
        options={{
          ...screenOptions,
          headerStyle: {
            backgroundColor: Colors.ASSESSMENT_IMAGE_BACKGROUND,
          },
        }}
      />
      <Stack.Screen
        component={AssessmentEndShare}
        name='EndShare'
        options={{
          ...screenOptions,
          headerStyle: {
            backgroundColor: Colors.ASSESSMENT_IMAGE_BACKGROUND,
          },
        }}
      />
       <Stack.Screen
        component={AssessmentCaptcha}
        name='AssessmentCaptcha'
        options={{
          ...screenOptions,
          headerStyle: {
            backgroundColor: Colors.ASSESSMENT_IMAGE_BACKGROUND,
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default Assessment;

/**
 * @param survey {Survey}
 * @param key {string}
 */
function getQuestion(survey, key) {
  const question = survey.questions.find(q => q.question_key === key);
  const option = survey.options.find(o => o.key === question.option_key);
  return { question, option };
}

/**
 * @param params {{
 *   answers: React.MutableRefObject<SurveyAnswers>;
 *   navigation: any;
 *   route: any;
 *   survey: Survey;
 * }}
 */
function onNextQuestion({ answers, navigation, route, survey }) {
  /** @type {{ question: SurveyQuestion }} */
  const { question } = route.params;
  const response = answers.current[question.id];
  let nextKey =
    survey.questions[survey.questions.indexOf(question) + 1].question_key;
  if (question.id === 'AGREE_QUESTION') {
    if (response.some(r => r.value === 'DISAGREE')) {
      return showAgreeAlert();
    }
  }
  if (question.conditions) {
    for (const condition of question.conditions) {
      if (response.some(r => r.value === condition.response)) {
        nextKey = condition.jump_to_key;
        break;
      }
    }
  }
  let nextQuestion = getQuestion(survey, nextKey);
  if (nextQuestion.question.question_type === 'END') {
    navigation.push(nextQuestion.question.screen_type);
    return;
  }
  navigation.push(`Question`, {
    answers: answers.current,
    ...nextQuestion,
  });
}

/** @type {() => Survey} */
const createSurvey = () => ({
  questions: [
    {
      conditions: [
        {
          jump_to_key: '2a',
          response: 'yes',
        },
        {
          jump_to_key: '3',
          response: 'no',
        },
        {
          jump_to_key: '3',
          response: 'skip',
        },
      ],
      id: '2',
      option_key: 'option_2',
      question_key: '2',
      question_text: 'Have you been diagnosed with covid?',
      question_type: 'TEXT',
      required: false,
      screen_type: 'RADIO',
    },
    {
      id: '2a',
      option_key: 'option_2a',
      question_key: '2a',
      question_text: 'When were you diagnosed?',
      question_type: 'DATE',
      required: false,
      screen_type: 'RADIO',
    },
    {
      id: '3',
      option_key: 'option_3',
      question_key: '3',
      question_text: 'Check all that apply',
      question_type: 'MULTI',
      required: false,
      screen_type: 'CHECKBOX',
    },
    {
      conditions: [
        {
          jump_to_key: 'end_caregiver',
          response: 'end_caregiver',
        },
        {
          jump_to_key: 'end_distancing',
          response: 'end_distancing',
        },
        {
          jump_to_key: 'end_emergency',
          response: 'end_emergency',
        },
        {
          jump_to_key: 'end_isolate',
          response: 'end_isolate',
        },
      ],
      id: '4',
      option_key: 'option_4',
      question_key: '4',
      question_text: 'Choose your ending',
      question_type: 'TEXT',
      required: false,
      screen_type: 'RADIO',
    },
    // END
    {
      id: 'end_caregiver',
      option_key: '',
      question_key: 'end_caregiver',
      question_text: '',
      question_type: 'END',
      required: false,
      screen_type: 'END_CAREGIVER',
    },
    {
      id: 'end_distancing',
      option_key: '',
      question_key: 'end_distancing',
      question_text: '',
      question_type: 'END',
      required: false,
      screen_type: 'END_DISTANCING',
    },
    {
      id: 'end_emergency',
      option_key: '',
      question_key: 'end_emergency',
      question_text: '',
      question_type: 'END',
      required: false,
      screen_type: 'END_EMERGENCY',
    },
    {
      id: 'end_isolate',
      option_key: '',
      question_key: 'end_isolate',
      question_text: '',
      question_type: 'END',
      required: false,
      screen_type: 'END_ISOLATE',
    },
  ],
  options: [
    {
      key: 'option_2',
      values: [
        {
          label: 'Yes',
          value: 'yes',
        },
        {
          label: 'No',
          value: 'no',
        },
        {
          label: 'Choose not to answer',
          value: 'skip',
        },
      ],
    },
    {
      key: 'option_2a',
      values: [
        {
          label: 'Select Date',
          value: 'DATE',
        },

        {
          label: 'Choose not to answer',
          value: 'skip',
        },
      ],
    },
    {
      key: 'option_3',
      values: [
        {
          label: 'A',
          value: 'a',
        },
        {
          label: 'B',
          value: 'b',
        },
      ],
    },
    {
      key: 'option_4',
      values: [
        {
          label: 'Caregiver',
          value: 'end_caregiver',
        },
        {
          label: 'Distancing',
          value: 'end_distancing',
        },
        {
          label: 'Emergency',
          value: 'end_emergency',
        },
        {
          label: 'Isolate',
          value: 'end_isolate',
        },
      ],
    },
  ],
});

/** @type {SurveyQuestion} */
const agreeQuestion = {
  id: 'AGREE_QUESTION',
  option_key: 'COVID_AGREE_OPTION',
  question_description: i18n.t('assessment.agree_question_description'),
  question_key: '',
  question_text: i18n.t('assessment.agree_question_text'),
  question_type: 'TEXT',
  required: true,
  screen_type: 'RADIO',
};

/** @type {SurveyOption} */
const agreeOption = {
  key: 'AGREE_OPTION',
  values: [
    {
      label: i18n.t('assessment.agree_option_agree'),
      value: 'AGREE',
    },
    {
      label: i18n.t('assessment.agree_option_disagree'),
      value: 'DISAGREE',
    },
  ],
};

function showAgreeAlert() {
  return new Promise(resolve => {
    Alert.alert(
      i18n.t('assessment.agree_alert_title'),
      i18n.t('assessment.agree_alert_description'),
      [{ text: 'OK', onPress: resolve }],
      { cancelable: false },
    );
  });
}
