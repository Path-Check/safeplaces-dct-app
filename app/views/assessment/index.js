import { CardStyleInterpolators } from '@react-navigation/stack';
import React, { useMemo, useRef } from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import { SvgXml } from 'react-native-svg';
import { Icons } from '../../assets';
import { useSurvey } from '../../helpers/CustomHooks';
import i18n from '../../locales/languages';
import { AnswersContext, MetaContext, SurveyContext } from './Context';
import { Question } from './Question';
import { Start } from './Start';
import {
  END_ROUTES,
  OPTION_VALUE_DISAGREE,
  QUESTION_KEY_AGREE,
  SCREEN_TYPE_CAREGIVER,
  SCREEN_TYPE_DISTANCING,
  SCREEN_TYPE_EMERGENCY,
  SCREEN_TYPE_END,
  SCREEN_TYPE_ISOLATE,
} from './constants';
import { Caregiver } from './endScreens/Caregiver';
import { Complete } from './endScreens/Complete';
import { Distancing } from './endScreens/Distancing';
import { Emergency } from './endScreens/Emergency';
import { Isolate } from './endScreens/Isolate';
import { Share } from './endScreens/Share';

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
  /** @type {React.MutableRefObject<SurveyAnswers>} */
  const answers = useRef({});
  const survey = useSurvey();

  const QuestionScreen = useMemo(
    // memoize assessment question
    () => ({ navigation, route }) => (
      <Question
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
      onPress={() => {
        navigation.goBack();
        navigation.popToTop();
      }}>
      <SvgXml xml={Icons.Close} />
    </TouchableOpacity>
  );

  const meta = useMemo(
    () => ({
      completeRoute: 'EndShare',
      dismiss: () => {
        navigation.goBack();
        navigation.popToTop();
      },
    }),
    [navigation],
  );
  const screenOptions = {
    headerHideShadow: true,
    headerTitle: '',
    headerStyle: {
      backgroundColor: Colors.primaryBackgroundFaintShade,
    },
    //eslint-disable-next-line
    headerRight: () => <AssessmentCancel />,
  };

  return (
    <MetaContext.Provider value={meta}>
      <SurveyContext.Provider value={survey}>
        {/* Since answers.current is on object, it won't trigger context updates
        when mutated, but that's ok — just trying to avoid prop drilling.*/}
        <AnswersContext.Provider value={answers.current}>
          <Stack.Navigator
            initialRouteName='Start'
            screenOptions={{
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              cardStyle: {
                backgroundColor: 'transparent',
              },
            }}>
            <Stack.Screen
              component={Start}
              name='Start'
              options={{
                ...screenOptions,
                headerStyle: {
                  backgroundColor: Colors.primaryBackgroundFaintShade,
                },
              }}
            />
            <Stack.Screen
              component={QuestionScreen}
              name='Question'
              options={screenOptions}
            />
            <Stack.Screen
              component={Complete}
              name='EndComplete'
              options={{
                ...screenOptions,
                headerStyle: {
                  backgroundColor: Colors.primaryBackgroundFaintShade,
                },
              }}
            />
            <Stack.Screen
              component={Share}
              name='EndShare'
              options={{
                ...screenOptions,
                headerStyle: {
                  backgroundColor: Colors.primaryBackgroundFaintShade,
                },
              }}
            />
            <Stack.Screen
              component={Caregiver}
              name={SCREEN_TYPE_CAREGIVER}
              options={{
                ...screenOptions,
                headerStyle: {
                  backgroundColor: Colors.primaryBackgroundFaintShade,
                },
              }}
            />
            <Stack.Screen
              component={Distancing}
              name={SCREEN_TYPE_DISTANCING}
              options={{
                ...screenOptions,
                headerStyle: {
                  backgroundColor: Colors.primaryBackgroundFaintShade,
                },
              }}
            />
            <Stack.Screen
              component={Emergency}
              name={SCREEN_TYPE_EMERGENCY}
              options={{
                ...screenOptions,
                headerStyle: {
                  backgroundColor: Colors.primaryBackgroundFaintShade,
                },
              }}
            />
            <Stack.Screen
              component={Isolate}
              name={SCREEN_TYPE_ISOLATE}
              options={{
                ...screenOptions,
                headerStyle: {
                  backgroundColor: Colors.primaryBackgroundFaintShade,
                },
              }}
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
  if (question.question_key === QUESTION_KEY_AGREE) {
    if (response.some((r) => r.value === OPTION_VALUE_DISAGREE)) {
      return showAgreeAlert();
    }
  }

  const nextKey = selectNextQuestion(survey, question, response);

  let nextQuestion = getQuestion(survey, nextKey);
  if (nextQuestion.question.question_type === SCREEN_TYPE_END) {
    if (END_ROUTES.includes(nextQuestion.question.screen_type))
      return navigation.push(nextQuestion.question.screen_type);
    navigation.push('EndComplete');
    return;
  }

  navigation.push(`Question`, {
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

function showAgreeAlert() {
  return new Promise((resolve) => {
    Alert.alert(
      i18n.t('assessment.agree_alert_title'),
      i18n.t('assessment.agree_alert_description'),
      [{ text: 'OK', onPress: resolve }],
      { cancelable: false },
    );
  });
}
