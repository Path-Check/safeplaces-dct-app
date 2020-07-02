import React from 'react';
import {
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  TextStyle,
  View,
  ScrollView,
  ImageSourcePropType,
  ViewStyle,
} from 'react-native';
import { SvgXml } from 'react-native-svg';

import { useStatusBarEffect } from '../../navigation';
import { Typography } from '../../components/Typography';

import {
  Buttons,
  Colors,
  Layout,
  Spacing,
  Iconography,
  Typography as TypographyStyles,
} from '../../styles';

export enum IconStyle {
  Blue,
  Gold,
}

type ExplanationScreenContent = {
  icon: string;
  header: string;
  body: string;
  primaryButtonLabel: string;
  secondaryButtonLabel?: string;
  backgroundImage: ImageSourcePropType;
};

type ExplanationScreenStyles = {
  headerStyle?: TextStyle;
  bodyStyle?: TextStyle;
  primaryButtonContainerStyle?: ViewStyle;
  primaryButtonTextStyle?: TextStyle;
  secondaryButtonContainerStyle?: ViewStyle;
  secondaryButtonTextStyle?: TextStyle;
  backgroundStyle?: ViewStyle;
  iconStyle: IconStyle;
};

type ExplanationScreenActions = {
  primaryButtonOnPress: () => void;
  secondaryButtonOnPress?: () => void;
};

interface ExplanationScreenProps {
  explanationScreenContent: ExplanationScreenContent;
  explanationScreenStyles: ExplanationScreenStyles;
  explanationScreenActions: ExplanationScreenActions;
}

const ExplanationScreen = ({
  explanationScreenContent,
  explanationScreenStyles,
  explanationScreenActions,
}: ExplanationScreenProps): JSX.Element => {
  useStatusBarEffect('dark-content');

  const iconStyle =
    explanationScreenStyles.iconStyle == IconStyle.Blue
      ? styles.blueIcon
      : styles.goldIcon;

  const primaryButtonTextStyles = {
    ...styles.primaryButtonText,
    ...explanationScreenStyles.primaryButtonTextStyle,
  };

  const secondaryButtonTextStyles = {
    ...styles.secondaryButtonText,
    ...explanationScreenStyles.secondaryButtonTextStyle,
  };

  const headerStyles = {
    ...styles.headerText,
    ...explanationScreenStyles.headerStyle,
  };

  const contentStyles = {
    ...styles.contentText,
    ...explanationScreenStyles.bodyStyle,
  };

  const smallScreenWidth = Layout.screenWidth <= Layout.smallScreenWidth;

  return (
    <View style={styles.outerContainer}>
      {smallScreenWidth ? null : (
        <ImageBackground
          source={explanationScreenContent.backgroundImage}
          style={[styles.background, explanationScreenStyles.backgroundStyle]}
        />
      )}
      <View style={styles.content}>
        <ScrollView
          alwaysBounceVertical={false}
          style={styles.innerContainer}
          contentContainerStyle={{ paddingBottom: Spacing.large }}>
          <View style={iconStyle}>
            <SvgXml xml={explanationScreenContent.icon} />
          </View>
          <Typography style={headerStyles}>
            {explanationScreenContent.header}
          </Typography>
          <Typography style={contentStyles}>
            {explanationScreenContent.body}
          </Typography>
        </ScrollView>
        <TouchableOpacity
          onPress={explanationScreenActions.primaryButtonOnPress}
          style={[
            styles.primaryButton,
            explanationScreenStyles.primaryButtonContainerStyle,
          ]}>
          <Typography style={primaryButtonTextStyles}>
            {explanationScreenContent.primaryButtonLabel}
          </Typography>
        </TouchableOpacity>
        {explanationScreenContent.secondaryButtonLabel && (
          <TouchableOpacity
            onPress={explanationScreenActions.secondaryButtonOnPress}
            style={[
              styles.secondaryButton,
              explanationScreenStyles.secondaryButtonContainerStyle,
            ]}>
            <Typography style={secondaryButtonTextStyles}>
              {explanationScreenContent.secondaryButtonLabel}
            </Typography>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: Colors.primaryBackground,
  },
  innerContainer: {
    paddingVertical: Spacing.large,
  },
  background: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    position: 'absolute',
  },
  blueIcon: {
    ...Iconography.largeBlueIcon,
    marginBottom: Spacing.xHuge,
  },
  goldIcon: {
    ...Iconography.largeGoldIcon,
    marginBottom: Spacing.xHuge,
  },
  content: {
    flex: 1,
    padding: Spacing.large,
  },
  headerText: {
    ...TypographyStyles.header2,
  },
  contentText: {
    ...TypographyStyles.mainContentViolet,
    marginTop: Spacing.xLarge,
  },
  primaryButton: {
    ...Buttons.largeSecondaryBlue,
  },
  secondaryButton: {
    ...Buttons.largeTransparent,
  },
  primaryButtonText: {
    ...TypographyStyles.buttonTextLight,
  },
  secondaryButtonText: {
    ...TypographyStyles.buttonTextLight,
  },
});

export default ExplanationScreen;
