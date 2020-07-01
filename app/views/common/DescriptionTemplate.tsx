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

type DescriptionTemplateProps = {
  iconXml: string;
  header: string;
  headerStyle?: TextStyle;
  body: string;
  bodyStyle?: TextStyle;
  primaryButtonLabel: string;
  primaryButtonContainerStyle?: ViewStyle;
  primaryButtonTextStyle?: TextStyle;
  primaryButtonOnPress: () => void;
  secondaryButtonLabel?: string;
  secondaryButtonContainerStyle?: ViewStyle;
  secondaryButtonTextStyle?: TextStyle;
  secondaryButtonOnPress?: () => void;
  backgroundImage: ImageSourcePropType;
  backgroundStyle?: ViewStyle;
  invertIcon?: boolean;
};

const DescriptionTemplate = ({
  iconXml,
  header,
  headerStyle,
  body,
  bodyStyle,
  primaryButtonLabel,
  primaryButtonContainerStyle,
  primaryButtonTextStyle,
  primaryButtonOnPress,
  secondaryButtonLabel,
  secondaryButtonContainerStyle,
  secondaryButtonTextStyle,
  secondaryButtonOnPress,
  backgroundImage,
  backgroundStyle,
  invertIcon,
}: DescriptionTemplateProps): JSX.Element => {
  useStatusBarEffect('dark-content');

  const iconStyle = invertIcon ? styles.goldIcon : styles.blueIcon;

  const primaryButtonTextStyles = {
    ...primaryButtonTextStyle,
    ...styles.primaryButtonText,
  };

  const secondaryButtonTextStyles = {
    ...secondaryButtonTextStyle,
    ...styles.secondaryButtonText,
  };

  const headerStyles = {
    ...styles.headerText,
    ...headerStyle,
  };

  const contentStyles = {
    ...styles.contentText,
    ...bodyStyle,
  };

  return (
    <View style={styles.outerContainer}>
      {Layout.screenWidth <= Layout.smallScreenWidth ? null : (
        <ImageBackground
          source={backgroundImage}
          style={[styles.background, backgroundStyle]}
        />
      )}
      <View style={styles.content}>
        <ScrollView
          alwaysBounceVertical={false}
          style={styles.innerContainer}
          contentContainerStyle={{ paddingBottom: Spacing.large }}>
          <View style={iconStyle}>
            <SvgXml xml={iconXml} />
          </View>
          <Typography style={headerStyles}>{header}</Typography>
          <Typography style={contentStyles}>{body}</Typography>
        </ScrollView>
        <TouchableOpacity
          onPress={primaryButtonOnPress}
          style={[styles.primaryButton, primaryButtonContainerStyle]}>
          <Typography style={primaryButtonTextStyles}>
            {primaryButtonLabel}
          </Typography>
        </TouchableOpacity>
        {secondaryButtonLabel && (
          <TouchableOpacity
            onPress={secondaryButtonOnPress}
            style={[styles.secondaryButton, secondaryButtonContainerStyle]}>
            <Typography style={secondaryButtonTextStyles}>
              {secondaryButtonLabel}
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

export default DescriptionTemplate;
