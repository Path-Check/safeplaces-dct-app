import React from 'react';
import {
  ImageBackground,
  StatusBar,
  StyleSheet,
  View,
  ScrollView,
  ImageSourcePropType,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import { Button } from '../../components/Button';
import { Typography } from '../../components/Typography';

import { Colors, Layout, Spacing } from '../../styles';
import { Theme } from '../../constants/themes';

type OnboardingTemplateProps = {
  iconXml: string;
  title: string;
  body: string;
  primaryButtonLabel: string;
  primaryButtonOnPress: () => void;
  secondaryButtonLabel?: string;
  secondaryButtonOnPress?: () => void;
  theme: 'light' | 'dark';
  background: ImageSourcePropType;
  invertIcon?: boolean;
};

const OnboardingTemplate = ({
  background,
  iconXml,
  title,
  body,
  primaryButtonLabel,
  primaryButtonOnPress,
  secondaryButtonLabel,
  secondaryButtonOnPress,
  invertIcon,
  theme,
}: OnboardingTemplateProps): JSX.Element => {
  return (
    <Theme use={theme === 'light' ? 'default' : 'violet'}>
      <View style={[styles.wrapper, theme === 'dark' && styles.darkWrapper]}>
        <StatusBar
          barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor='transparent'
          translucent
        />
        {Layout.screenWidth <= Layout.smallScreenWidth ? null : (
          <ImageBackground source={background} style={styles.backgroundImage} />
        )}
        <View style={styles.content}>
          <ScrollView
            alwaysBounceVertical={false}
            contentContainerStyle={{ paddingBottom: Spacing.large }}>
            <View style={[styles.iconCircle, invertIcon && styles.goldIcon]}>
              <SvgXml xml={iconXml} width={30} height={30} />
            </View>
            <Typography
              use={'headline2'}
              style={theme === 'dark' ? styles.lightText : {}}>
              {title}
            </Typography>
            <View style={{ height: Spacing.medium }} />
            <Typography
              use={'body2'}
              style={theme === 'dark' ? styles.lightText : {}}>
              {body}
            </Typography>
          </ScrollView>
          {secondaryButtonOnPress && secondaryButtonLabel && (
            <>
              <Button
                secondary
                label={secondaryButtonLabel}
                onPress={secondaryButtonOnPress}
              />
              <View style={{ height: Spacing.xSmall }} />
            </>
          )}
          <Button label={primaryButtonLabel} onPress={primaryButtonOnPress} />
        </View>
      </View>
    </Theme>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    position: 'absolute',
  },
  iconCircle: {
    height: 70,
    width: 70,
    backgroundColor: Colors.onboardingIconBlue,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Spacing.large,
  },
  goldIcon: {
    backgroundColor: Colors.onboardingIconYellow,
  },
  wrapper: {
    flex: 1,
    backgroundColor: Colors.primaryBackgroundFaintShade,
  },
  darkWrapper: {
    backgroundColor: Colors.royalBlue,
  },
  content: {
    flex: 1,
    padding: Spacing.large,
  },
  lightText: {
    color: Colors.white,
  },
});

export default OnboardingTemplate;
