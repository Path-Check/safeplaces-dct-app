import { CardStyleInterpolators } from '@react-navigation/stack';
import React, { useMemo, useRef } from 'react';
import { TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import { SvgXml } from 'react-native-svg';
import { Icons } from '../../assets';
import { useSurvey } from '../../helpers/CustomHooks';
import { AnswersContext, MetaContext, SurveyContext } from './Context';
import { AssessmentQuestion } from './AssessmentQuestion';
import { AssessmentStart } from './AssessmentStart';
import { Agreement } from './Agreement';
import { EmergencyAssessment } from './EmergencyAssessment';
import {
  END_ROUTES,
  SCREEN_TYPE_CAREGIVER,
  SCREEN_TYPE_DISTANCING,
  SCREEN_TYPE_EMERGENCY,
  SCREEN_TYPE_END,
  SCREEN_TYPE_ISOLATE,
} from './constants';
import { Caregiver } from './endScreens/Caregiver';
import { AssessmentComplete } from './endScreens/AssessmentComplete';
import { Distancing } from './endScreens/Distancing';
import { Emergency } from './endScreens/Emergency';
import { Isolate } from './endScreens/Isolate';
import { Share } from './endScreens/Share';
import { useStatusBarEffect } from '../../navigation';

import { Colors } from '../../styles';

/**
 * @typedef {"Checkbox" | "Date" | Radio" | "EndCaregiver" | "EndDistancing" | "EndEmergency" | "EndIsolate" } SurveyScreen
 *
 * @typedef {{
 *   options: SurveyOption[]
 *   questions: SurveyQuestion[],
 *   screen_types: SurveyScreen[]
 * }} Survey
 *
 * @typedef {{
 *   conditions?: [{ response: string; value: string; }]
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

/** @type {{ [key: string]: Survey }} */

const Stack = createStackNavigator();

const Assessment = ({ navigation }) => {
  useStatusBarEffect('dark-content');

  /** @type {React.MutableRefObject<SurveyAnswers>} */
  const answers = useRef({});
  const survey = useSurvey();

  const QuestionScreen = useMemo(
    // TODO: This question handling is a mess and should be refactored
    // to support dynamic questions

    // memoize assessment question
    () => ({ navigation, route }) => (
      <AssessmentQuestion
        {...route.params}
        onNext={() => {
          onNextQuestion({ answers, navigation, route, survey });
        }}
        onChange={(value) => {
          let { question } = route.params;
          answers.current[question.question_key] = value;
        }}
      />
    ),
    [answers, survey],
  );

  const AssessmentCancel = () => (
    <TouchableOpacity
      style={{ paddingRight: 25 }}
      onPress={() => {
        navigation.navigate('AssessmentStart');
      }}>
      <SvgXml xml={Icons.Close} fill={Colors.quaternaryViolet} />
    </TouchableOpacity>
  );

  const AssessmentBack = () => (
    <TouchableOpacity
      style={{ paddingLeft: 25 }}
      onPress={() => navigation.pop()}>
      <SvgXml xml={Icons.BackArrow} color={Colors.quaternaryViolet} />
    </TouchableOpacity>
  );

  const meta = useMemo(
    () => ({
      completeRoute: 'EndShare',
      dismiss: () => {
        navigation.navigate('AssessmentStart');
      },
    }),
    [navigation],
  );
  const screenOptions = (backgroundColor = Colors.surveyPrimaryBackground) => ({
    headerHideShadow: true,
    headerTitle: '',
    headerStyle: {
      backgroundColor: backgroundColor,
      shadowOffset: { height: 0, width: 0 }, // this removes the header border
    },
    headerLeft: AssessmentBack,
    headerRight: AssessmentCancel,
  });

  return (
    <MetaContext.Provider value={meta}>
      <SurveyContext.Provider value={survey}>
        {/* Since answers.current is on object, it won't trigger context updates
        when mutated, but that's ok — just trying to avoid prop drilling.*/}
        <AnswersContext.Provider value={answers.current}>
          <Stack.Navigator
            initialRouteName='AssessmentStart'
            screenOptions={{
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              cardStyle: {
                backgroundColor: Colors.transparent,
              },
            }}>
            <Stack.Screen
              component={AssessmentStart}
              name='AssessmentStart'
              options={{
                ...screenOptions(),
                headerLeft: () => null,
                headerRight: () => null,
              }}
            />
            <Stack.Screen
              component={Agreement}
              name='Agreement'
              options={{
                ...screenOptions(Colors.invertedQuaternaryBackground),
              }}
            />
            <Stack.Screen
              component={EmergencyAssessment}
              name='EmergencyAssessment'
              options={screenOptions()}
            />
            <Stack.Screen
              component={QuestionScreen}
              name='AssessmentQuestion'
              options={screenOptions()}
            />
            <Stack.Screen
              component={AssessmentComplete}
              name='AssessmentComplete'
              options={screenOptions()}
            />
            <Stack.Screen
              component={Share}
              name='EndShare'
              options={{
                ...screenOptions(Colors.invertedQuaternaryBackground),
              }}
            />
            <Stack.Screen
              component={Caregiver}
              name={SCREEN_TYPE_CAREGIVER}
              options={screenOptions()}
            />
            <Stack.Screen
              component={Distancing}
              name={SCREEN_TYPE_DISTANCING}
              options={screenOptions()}
            />
            <Stack.Screen
              component={Emergency}
              name={SCREEN_TYPE_EMERGENCY}
              options={screenOptions()}
            />
            <Stack.Screen
              component={Isolate}
              name={SCREEN_TYPE_ISOLATE}
              options={screenOptions()}
            />
          </Stack.Navigator>
        </AnswersContext.Provider>
      </SurveyContext.Provider>
    </MetaContext.Provider>
  );
};

export default Assessment;

/**
 * @param survey {Survey}
 * @param key {string}
 */
function getQuestion(survey, key) {
  const question = survey.questions.find((q) => q.question_key === key);
  const option = survey.options.find((o) => o.key === question.option_key);
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
  const response = answers.current[question.question_key];

  const nextKey = selectNextQuestion(survey, question, response);

  let nextQuestion = getQuestion(survey, nextKey);
  if (nextQuestion.question.question_type === SCREEN_TYPE_END) {
    if (END_ROUTES.includes(nextQuestion.question.screen_type))
      return navigation.push(nextQuestion.question.screen_type);
    navigation.push('AssessmentComplete');
    return;
  }

  navigation.push(`AssessmentQuestion`, {
    ...nextQuestion,
  });
}

function selectNextQuestion(survey, question, answer) {
  let index = survey.questions.findIndex(
    (q) => q.question_key === question.question_key,
  );
  if (question.conditions) {
    for (const condition of question.conditions) {
      if (answer.some((r) => r.value === condition.response)) {
        return condition.jump_to_key;
      }
    }
  }
  return survey.questions[index + 1].question_key;
}
