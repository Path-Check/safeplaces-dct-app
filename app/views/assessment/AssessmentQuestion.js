import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import AssessmentButton from './AssessmentButton';
import AssessmentOption from './AssessmentOption';

/**
 * @typedef { import("./Assessment").SurveyQuestion } SurveyQuestion
 * @typedef { import("./Assessment").SurveyOption } SurveyOption
 * @typedef { import("./Assessment").SurveyAnswers } SurveyAnswers
 */

/** @type {React.FunctionComponent<{
 *   answers: SurveyAnswers
 *   onNext: () => void;
 *   onChange: (value: { index: number, value: string }[]) => void;
 *   option: SurveyOption
 *   question: SurveyQuestion
 * }>} */
const AssessmentQuestion = ({
  answers,
  onNext,
  onChange,
  option,
  question,
}) => {
  const { t } = useTranslation();
  const [selectedValues, setSelectedValues] = useState(
    answers[question.id] || [],
  );
  /** @type {(value: string, index: number) => void} */
  const onSelectHandler = (value, index) => {
    switch (question.question_type) {
      case 'MULTI':
        setSelectedValues(values => {
          let exists = values.some(v => v.index === index);
          if (exists) {
            return values.filter(v => v.index !== index);
          } else {
            return values.concat([{ index, value }]);
          }
        });
        break;
      default:
        setSelectedValues([{ index, value }]);
    }
  };
  useEffect(() => {
    onChange(selectedValues);
  }, [selectedValues]);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.containerInner}>
        <View style={styles.header}>
          <Text style={styles.title}>{question.question_text}</Text>
          {question.question_description && (
            <Text style={styles.description}>
              {question.question_description}
            </Text>
          )}
        </View>
        <ScrollView style={{ flex: 1, padding: 20 }}>
          {['CHECKBOX', 'RADIO'].includes(question.screen_type) &&
            option.values.map((option, index) => (
              <AssessmentOption
                answer={selectedValues.find(v => v.index === index)}
                key={option.value}
                onSelect={value => onSelectHandler(value, index)}
                option={option}
                selected={selectedValues.some(v => v.index === index)}
                type={question.screen_type}
              />
            ))}
        </ScrollView>
        <View style={styles.footer}>
          <AssessmentButton onPress={onNext} title={t('assessment.next')} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.ASSESSMENT_BACKGROUND,
  },
  containerInner: {
    flex: 1,
  },
  header: {
    padding: 20,
  },
  title: {
    fontFamily: Fonts.primaryBold,
    fontSize: 30,
    fontWeight: 'bold',
  },
  description: {
    fontFamily: Fonts.primaryRegular,
    fontSize: 16,
    lineHeight: 25,
    marginTop: 10,
  },
  footer: {
    padding: 20,
  },
});

export default AssessmentQuestion;
