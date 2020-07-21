import React from 'react';
import {
  ImageBackground,
  StyleSheet,
  TextStyle,
  View,
  ScrollView,
  ImageSourcePropType,
  ViewStyle,
} from 'react-native';
import { SvgXml } from 'react-native-svg';

import { Button } from '../../components/Button';
import { useStatusBarEffect } from '../../navigation';
import { Typography } from '../../components/Typography';

import {
  Buttons,
  Colors,
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
  iconLabel: string;
  header: string;
  body: string;
  primaryButtonLabel: string;
  backgroundImage: ImageSourcePropType;
  secondaryButtonLabel?: string;
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

  const determineIconStyle = (iconStyle: IconStyle): ViewStyle => {
    switch (iconStyle) {
      case IconStyle.Blue:
        return styles.blueIcon;
      case IconStyle.Gold:
        return styles.goldIcon;
    }
  };

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

  const primaryButtonStyles = {
    ...styles.primaryButton,
    ...explanationScreenStyles.primaryButtonContainerStyle,
  };

  const secondaryButtonStyles = {
    ...styles.secondaryButton,
    ...explanationScreenStyles.secondaryButtonContainerStyle,
  };

  return (
    <View style={styles.outerContainer}>
      <ImageBackground
        source={explanationScreenContent.backgroundImage}
        style={[styles.background, explanationScreenStyles.backgroundStyle]}
      />
      <View style={styles.content}>
        <ScrollView
          alwaysBounceVertical={false}
          style={styles.innerContainer}
          contentContainerStyle={{ paddingBottom: Spacing.large }}>
          <View style={determineIconStyle(explanationScreenStyles.iconStyle)}>
            <SvgXml
              xml={explanationScreenContent.icon}
              accessible
              accessibilityLabel={explanationScreenContent.iconLabel}
            />
          </View>
          <Typography style={headerStyles}>
            {explanationScreenContent.header}
          </Typography>
          <Typography style={contentStyles}>
            {explanationScreenContent.body}
          </Typography>
        </ScrollView>
        <Button
          label={explanationScreenContent.primaryButtonLabel}
          onPress={explanationScreenActions.primaryButtonOnPress}
          style={primaryButtonStyles}
          textStyle={primaryButtonTextStyles}
        />
        {explanationScreenActions.secondaryButtonOnPress &&
          explanationScreenContent.secondaryButtonLabel && (
            <Button
              label={explanationScreenContent.secondaryButtonLabel}
              onPress={explanationScreenActions.secondaryButtonOnPress}
              style={secondaryButtonStyles}
              textStyle={secondaryButtonTextStyles}
            />
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
