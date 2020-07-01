import React from 'react';
import {
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import { Button } from './Button';

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
 *   title: string;
 * }>} */
export const Info = ({
  backgroundColor,
  backgroundImage,
  children,
  ctaAction,
  ctaBackgroundColor,
  ctaTextColor,
  ctaTitle,
  scrollStyle,
  footer,
  icon,
}) => {
  return (
    <SafeAreaView
      backgroundColor={backgroundColor}
      style={assessmentStyles.container}>
      <ImageBackground
        source={backgroundImage}
        style={assessmentStyles.backgroundImage}>
        <ScrollView style={assessmentStyles.scrollView}>
          <View style={[assessmentStyles.scrollViewContent, scrollStyle]}>
            {icon && <SvgXml xml={icon} />}
            {children}
          </View>
        </ScrollView>
        <View style={assessmentStyles.footer}>
          {ctaTitle && (
            <Button
              backgroundColor={ctaBackgroundColor}
              textColor={ctaTextColor} 
              onPress={ctaAction} 
              title={ctaTitle} />
            )}
          {footer}
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export const assessmentStyles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopWidth: 0
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    borderTopWidth: 0
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 20,
    borderTopWidth: 0
  },
  footer: {
    padding: 20,
  },
});
