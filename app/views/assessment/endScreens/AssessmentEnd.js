import React from 'react';
import {
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SvgXml } from 'react-native-svg';

import { Typography } from '../../../components/Typography';
import AssessmentButton from '../AssessmentButton';

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
  backgroundColor,
  backgroundImage,
  children,
  ctaAction,
  ctaColor,
  ctaTitle,
  description,
  fontColor,
  footer,
  icon,
  title,
}) => {
  return (
    <SafeAreaView
      backgroundColor={backgroundColor}
      style={assessmentStyles.container}>
      <ImageBackground
        source={backgroundImage}
        style={assessmentStyles.backgroundImage}>
        <ScrollView style={assessmentStyles.scrollView}>
          <View style={assessmentStyles.scrollViewContent}>
            <SvgXml xml={icon} />
            <Typography
              color={fontColor}
              use='headline2'
              style={assessmentStyles.headingSpacing}>
              {title}
            </Typography>
            {description && (
              <Typography
                color={fontColor}
                use='body1'
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
      </ImageBackground>
    </SafeAreaView>
  );
};

export default AssessmentEnd;

export const assessmentStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
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
  description: {
    marginBottom: 20,
  },
});
