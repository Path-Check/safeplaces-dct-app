import React from 'react';
import {
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  ImageSourcePropType,
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

type OnboardingTemplateProps = {
  iconXml: string;
  title: string;
  body: string;
  buttonLabel: string;
  buttonOnPress: () => void;
  background: ImageSourcePropType;
  invertIcon?: boolean;
};

const OnboardingTemplate = ({
  background,
  iconXml,
  title,
  body,
  buttonLabel,
  buttonOnPress,
  invertIcon,
}: OnboardingTemplateProps): JSX.Element => {
  useStatusBarEffect('dark-content');

  const iconStyle = invertIcon ? styles.goldIcon : styles.blueIcon;

  return (
    <View style={styles.wrapper}>
      {Layout.screenWidth <= Layout.smallScreenWidth ? null : (
        <ImageBackground source={background} style={styles.backgroundImage} />
      )}
      <View style={styles.content}>
        <ScrollView
          alwaysBounceVertical={false}
          contentContainerStyle={{ paddingBottom: Spacing.large }}>
          <View style={iconStyle}>
            <SvgXml xml={iconXml} width={30} height={30} />
          </View>
          <Typography style={styles.headerText}>{title}</Typography>
          <View style={{ height: Spacing.medium }} />
          <Typography style={styles.contentText}>{body}</Typography>
        </ScrollView>
        <TouchableOpacity onPress={buttonOnPress} style={styles.button}>
          <Typography style={styles.buttonText}>{buttonLabel}</Typography>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    position: 'absolute',
  },
  blueIcon: {
    ...Iconography.largeBlueIcon,
  },
  goldIcon: {
    ...Iconography.largeGoldIcon,
  },
  wrapper: {
    flex: 1,
    backgroundColor: Colors.primaryBackgroundFaintShade,
  },
  content: {
    flex: 1,
    padding: Spacing.large,
  },
  headerText: {
    ...TypographyStyles.header2,
  },
  contentText: {
    ...TypographyStyles.mainContent,
  },
  button: {
    ...Buttons.largeBlue,
  },
  buttonText: {
    ...TypographyStyles.buttonTextLight,
  },
});

export default OnboardingTemplate;
