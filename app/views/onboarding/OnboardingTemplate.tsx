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

type OnboardingTemplateProps = {
  iconXml: string;
  title: string;
  body: string;
  primaryButtonLabel: string;
  primaryButtonOnPress: () => void;
  secondaryButtonLabel?: string;
  secondaryButtonOnPress?: () => void;
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
}: OnboardingTemplateProps): JSX.Element => {
  return (
    <View style={styles.wrapper}>
      <StatusBar
        barStyle={'light-content'}
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
          <Typography use={'headline2'}>{title}</Typography>
          <View style={{ height: Spacing.medium }} />
          <Typography use={'body2'}>{body}</Typography>
        </ScrollView>
        {secondaryButtonOnPress && secondaryButtonLabel && (
          <>
            <Button
              label={secondaryButtonLabel}
              onPress={secondaryButtonOnPress}
            />
            <View style={{ height: Spacing.xSmall }} />
          </>
        )}
        <Button label={primaryButtonLabel} onPress={primaryButtonOnPress} />
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
  content: {
    flex: 1,
    padding: Spacing.large,
  },
});

export default OnboardingTemplate;
