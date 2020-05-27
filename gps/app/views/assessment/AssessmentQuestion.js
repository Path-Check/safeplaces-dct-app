import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

import { Typography } from '../../components/Typography';
import Colors from '../../constants/colors';
import AssessmentButton from './AssessmentButton';
import { AnswersContext } from './AssessmentContext';
import AssessmentOption from './AssessmentOption';
import {
  Colors as AssessmentColors,
  QUESTION_TYPE_MULTI,
  SCREEN_TYPE_CHECKBOX,
  SCREEN_TYPE_DATE,
  SCREEN_TYPE_RADIO,
} from './constants';

/**
 * @typedef { import("./Assessment").SurveyQuestion } SurveyQuestion
 * @typedef { import("./Assessment").SurveyOption } SurveyOption
 * @typedef { import("./Assessment").SurveyAnswers } SurveyAnswers
 */

/** @type {React.FunctionComponent<{
 *   onNext: () => void;
 *   onChange: (value: { index: number, value: string }[]) => void;
 *   option: SurveyOption
 *   question: SurveyQuestion
 * }>} */
const AssessmentQuestion = ({ onNext, onChange, option, question }) => {
  const { t } = useTranslation();
  const answers = useContext(AnswersContext);
  const [selectedValues, setSelectedValues] = useState(
    answers[question.id] || [],
  );

  // Allow line breaks in the description
  const description = useMemo(() => {
    if (!question.question_description) return null;
    const elements = [];
    for (const line of question.question_description.split('\n')) {
      let l = line.trim();
      if (!l) continue;
      elements.push(
        <Typography
          surveyFont
          testID='description'
          key={l}
          style={styles.description}>
          {l}
        </Typography>,
      );
    }
    return <View style={styles.descriptionWrapper}>{elements}</View>;
  }, [question.question_description]);

  const displayAsOption = [
    SCREEN_TYPE_CHECKBOX,
    SCREEN_TYPE_RADIO,
    SCREEN_TYPE_DATE,
  ].includes(question.screen_type);

  const options =
    displayAsOption &&
    option.values.map((option, index) => (
      <AssessmentOption
        answer={selectedValues.find(v => v.index === index)}
        index={index}
        key={option.value}
        onSelect={value => onSelectHandler(value, index)}
        option={option}
        isSelected={selectedValues.some(v => v.index === index)}
        type={question.screen_type}
      />
    ));

  /** @type {(value: string, index: number) => void} */
  const onSelectHandler = (value, index) => {
    if (question.question_type === QUESTION_TYPE_MULTI) {
      return setSelectedValues(values => {
        // this looks for an existing value inside the selected values array
        // which indicates user unselected the value
        const unselectedValue = values.some(v => v.index === index);
        if (unselectedValue) {
          // if thats true we remove the value from the values array
          return values.filter(v => v.index !== index);
        } else {
          return [...values, { index, value }];
        }
      });
    }
    return setSelectedValues([{ index, value }]);
  };

  useEffect(() => {
    onChange(selectedValues);
  }, [selectedValues, onChange]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.containerInner}>
        <View style={styles.header}>
          <Typography surveyFont style={styles.title}>
            {question.question_text}
          </Typography>
        </View>
        <ScrollView style={styles.scrollView}>
          <View style={styles.scrollViewContent}>
            {description}
            {options}
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <AssessmentButton
            disabled={!selectedValues.length}
            onPress={onNext}
            title={t('assessment.next')}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AssessmentColors.BACKGROUND,
  },
  containerInner: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    paddingTop: 20,
    color: Colors.BLACK,
    lineHeight: 33,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  descriptionWrapper: {
    marginBottom: 20,
  },
  description: {
    color: Colors.BLACK,
    fontSize: 20,
    lineHeight: 22,
    marginBottom: 10,
    fontWeight: '300',
  },
  footer: {
    padding: 20,
  },
});

export default AssessmentQuestion;
