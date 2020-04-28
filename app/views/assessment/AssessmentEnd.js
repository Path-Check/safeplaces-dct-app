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

import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import AssessmentButton from './AssessmentButton';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = WIDTH * (300 / 375);

/**
 * @typedef { import("react").ReactNode } ReactNode
 */

/** @type {React.FunctionComponent<{
 *   ctaAction: () => void;
 *   ctaColor?: string;
 *   ctaTitle: string;
 *   description: ReactNode;
 *   footer: ReactNode;
 *   image: string;
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
  title,
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Image source={image} style={{ width: WIDTH, height: HEIGHT }} />
        <View style={styles.scrollViewContent}>
          <Text
            style={[styles.title, { color: ctaColor ? ctaColor : undefined }]}>
            {title}
          </Text>
          <Text style={styles.description}>{description}</Text>
          {children}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        {footer}
        <AssessmentButton
          color={ctaColor}
          onPress={ctaAction}
          title={ctaTitle}
        />
      </View>
    </SafeAreaView>
  );
};

export default AssessmentShare;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.ASSESSMENT_BACKGROUND,
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
    fontSize: 18,
    lineHeight: 24,
    marginBottom: 30,
  },
  footer: {
    padding: 20,
  },
});
