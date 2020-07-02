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
  descriptionTemplateContent: ExplanationScreenContent;
  descriptionTemplateStyles: ExplanationScreenStyles;
  descriptionTemplateActions: ExplanationScreenActions;
}

const ExplanationScreen = ({
  descriptionTemplateContent,
  descriptionTemplateStyles,
  descriptionTemplateActions,
}: ExplanationScreenProps): JSX.Element => {
  useStatusBarEffect('dark-content');

  const iconStyle =
    descriptionTemplateStyles.iconStyle == IconStyle.Blue
      ? styles.blueIcon
      : styles.goldIcon;

  const primaryButtonTextStyles = {
    ...styles.primaryButtonText,
    ...descriptionTemplateStyles.primaryButtonTextStyle,
  };

  const secondaryButtonTextStyles = {
    ...styles.secondaryButtonText,
    ...descriptionTemplateStyles.secondaryButtonTextStyle,
  };

  const headerStyles = {
    ...styles.headerText,
    ...descriptionTemplateStyles.headerStyle,
  };

  const contentStyles = {
    ...styles.contentText,
    ...descriptionTemplateStyles.bodyStyle,
  };

  return (
    <View style={styles.outerContainer}>
      {Layout.screenWidth <= Layout.smallScreenWidth ? null : (
        <ImageBackground
          source={descriptionTemplateContent.backgroundImage}
          style={[styles.background, descriptionTemplateStyles.backgroundStyle]}
        />
      )}
      <View style={styles.content}>
        <ScrollView
          alwaysBounceVertical={false}
          style={styles.innerContainer}
          contentContainerStyle={{ paddingBottom: Spacing.large }}>
          <View style={iconStyle}>
            <SvgXml xml={descriptionTemplateContent.icon} />
          </View>
          <Typography style={headerStyles}>
            {descriptionTemplateContent.header}
          </Typography>
          <Typography style={contentStyles}>
            {descriptionTemplateContent.body}
          </Typography>
        </ScrollView>
        <TouchableOpacity
          onPress={descriptionTemplateActions.primaryButtonOnPress}
          style={[
            styles.primaryButton,
            descriptionTemplateStyles.primaryButtonContainerStyle,
          ]}>
          <Typography style={primaryButtonTextStyles}>
            {descriptionTemplateContent.primaryButtonLabel}
          </Typography>
        </TouchableOpacity>
        {descriptionTemplateContent.secondaryButtonLabel && (
          <TouchableOpacity
            onPress={descriptionTemplateActions.secondaryButtonOnPress}
            style={[
              styles.secondaryButton,
              descriptionTemplateStyles.secondaryButtonContainerStyle,
            ]}>
            <Typography style={secondaryButtonTextStyles}>
              {descriptionTemplateContent.secondaryButtonLabel}
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
