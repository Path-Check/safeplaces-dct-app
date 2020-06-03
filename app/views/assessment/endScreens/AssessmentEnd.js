import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { Typography } from '../../../components/Typography';
import Colors from '../../../constants/colors';
import AssessmentButton from '../AssessmentButton';
import { SvgXml } from 'react-native-svg';

/**
 * @typedef { import("react").ReactNode } ReactNode
 */

/** @type {React.FunctionComponent<{
 *   ctaAction?: () => void;
 *   ctaColor?: string;
 *   ctaTitle?: string;
 *   description?: ReactNode;
 *   footer?: ReactNode;
 *   image: string;
 *   pretitle?: ReactNode;
 *   title: string;
 * }>} */
const AssessmentEnd = ({
  ctaAction,
  ctaColor,
  ctaTitle,
  description,
  children,
  footer,
  icon,
  title,
}) => {
  return (
    <SafeAreaView style={assessmentStyles.container}>
      <ScrollView style={assessmentStyles.scrollView}>
        <View style={assessmentStyles.scrollViewContent}>
          <SvgXml xml={icon} />
          <Typography use='headline2' style={assessmentStyles.headingSpacing}>
            {title}
          </Typography>
          {description && (
            <Typography
              use='body1'
              testID='description'>
              {description}
            </Typography>
          )}
          {children}
        </View>
      </ScrollView>
      <View style={assessmentStyles.footer}>
        {footer}
        {ctaTitle && (
          <AssessmentButton
            color={ctaColor}
            onPress={ctaAction}
            title={ctaTitle}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default AssessmentEnd;

export const assessmentStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.SECONDARY_10,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 20,
  },
  headingSpacing: {
    marginVertical: 30,
  },
  footer: {
    padding: 20,
  },
  // this is exported and used elsewhere
  // eslint-disable-next-line react-native/no-unused-styles
  boldBlackText: {
    color: Colors.BLACK,
    fontWeight: 'bold',
    fontSize: 20,
  },
});
