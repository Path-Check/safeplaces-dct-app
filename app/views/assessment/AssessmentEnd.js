import React from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Fonts from '../../constants/fonts';
import AssessmentButton from './AssessmentButton';
import { Colors as AssessmentColors } from './constants';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = WIDTH * (300 / 375);

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
const AssessmentShare = ({
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
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Image source={image} style={{ width: WIDTH, height: HEIGHT }} />
        <View style={styles.scrollViewContent}>
          {pretitle}
          <Text
            style={[styles.title, { color: ctaColor ? ctaColor : undefined }]}>
            {title}
          </Text>
          {description ? (
            <Text style={styles.description}>{description}</Text>
          ) : null}
          {children}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        {footer}
        {ctaTitle ? (
          <AssessmentButton
            color={ctaColor}
            onPress={ctaAction}
            title={ctaTitle}
          />
        ) : null}
      </View>
    </SafeAreaView>
  );
};

export default AssessmentShare;

const styles = StyleSheet.create({
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
    fontFamily: Fonts.primaryBold,
    fontSize: 30,
    marginBottom: 10,
  },
  description: {
    fontFamily: Fonts.primaryRegular,
    fontSize: 20,
    lineHeight: 26,
    marginBottom: 30,
  },
  footer: {
    padding: 20,
  },
});
