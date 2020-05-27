import React from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { Typography } from '../../../components/Typography';
import Colors from '../../../constants/colors';
import AssessmentButton from '../AssessmentButton';
import { Colors as AssessmentColors } from '../constants';

const WIDTH = Dimensions.get('window').width;
const CONTAINER_WIDTH = 300 / 375;
const HEIGHT = WIDTH * CONTAINER_WIDTH;

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
  image,
  pretitle,
  title,
}) => {
  return (
    <SafeAreaView style={assessmentStyles.container}>
      <ScrollView style={assessmentStyles.scrollView}>
        <Image source={image} style={{ width: WIDTH, height: HEIGHT }} />
        <View style={assessmentStyles.scrollViewContent}>
          {pretitle}
          <Typography
            surveyFont
            style={[
              assessmentStyles.title,
              { color: ctaColor ? ctaColor : undefined },
            ]}>
            {title}
          </Typography>
          {description && (
            <Typography
              surveyFont
              style={assessmentStyles.description}
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
    backgroundColor: AssessmentColors.BACKGROUND,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 20,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 28,
    paddingVertical: 15,
  },
  description: {
    fontSize: 20,
    lineHeight: 26,
    marginBottom: 30,
    color: Colors.BLACK,
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
