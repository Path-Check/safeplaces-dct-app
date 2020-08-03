import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  TextStyle,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { BackHandler } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SvgXml } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '../../components/Button';
import { IconButton } from '../../components/IconButton';
import { Typography } from '../../components/Typography';

import { Icons } from '../../assets';
import { Colors, Typography as TypographyStyles } from '../../styles';
import { useStatusBarEffect } from '../../navigation';
import { useFocusEffect } from '@react-navigation/native';
import { isPlatformAndroid } from '../../Util';

interface BackgroundContainerProps {
  lightTheme?: string;
  children: JSX.Element;
}

const BackgroundContainer = ({
  lightTheme,
  children,
}: BackgroundContainerProps): JSX.Element => {
  if (lightTheme) {
    return <View style={styles.container}>{children}</View>;
  }
  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      colors={[Colors.secondaryBlue, Colors.primaryBlue]}
      style={styles.container}>
      {children}
    </LinearGradient>
  );
};

interface ExportTemplateProps {
  headline: string;
  body: string;
  onNext: () => void;
  nextButtonLabel: string;
  // Optionals:
  buttonSubtitle?: string;
  onClose?: () => void;
  icon?: string;
  lightTheme?: string;
  buttonLoading?: boolean;
  // We can consider instead using the trans component:
  // https://react.i18next.com/latest/trans-component
  bodyLinkText?: string;
  bodyLinkOnPress?: () => void;
  ignoreModalStyling?: boolean; // So first screen can be slightly different in tabs
}

export const ExportTemplate = ({
  headline,
  body,
  onNext,
  nextButtonLabel,
  // Optionals:
  buttonSubtitle,
  onClose,
  icon,
  lightTheme,
  buttonLoading,
  // We can consider instead using the trans component:
  // https://react.i18next.com/latest/trans-component
  bodyLinkText,
  bodyLinkOnPress,
  ignoreModalStyling, // So first screen can be slightly different in tabs
}: ExportTemplateProps): JSX.Element => {
  useStatusBarEffect(lightTheme ? 'dark-content' : 'light-content');
  useFocusEffect(() => {
    if (onClose) {
      const handleBackPress = () => {
        onClose();
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', handleBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    }
    return;
  });

  return (
    <View style={{ flex: 1 }}>
      {!ignoreModalStyling && isPlatformAndroid() && (
        <StatusBar
          backgroundColor={
            lightTheme ? Colors.primaryBackground : Colors.primaryBlue
          }
        />
      )}
      <BackgroundContainer lightTheme={lightTheme}>
        <SafeAreaView style={{ flex: 1, marginBottom: 24 }}>
          {onClose && (
            <View style={styles.header}>
              <IconButton
                icon={Icons.Close}
                size={22}
                onPress={onClose}
                color={lightTheme ? Colors.primaryViolet : Colors.white}
              />
            </View>
          )}
          <ScrollView
            alwaysBounceVertical={false}
            style={{ flexGrow: 1 }}
            contentContainerStyle={{
              // Opt for center alignment without icons,
              // top alignment with icon.
              justifyContent: icon ? undefined : 'center',
              flexGrow: 1,
              paddingBottom: 24,
            }}>
            {/* Add top padding if we can afford it */}
            {<View style={{ maxHeight: 20, flexGrow: 1 }} />}
            {icon && (
              <View style={styles.iconContainerCircle}>
                <SvgXml xml={icon as string} width={30} height={30} />
              </View>
            )}

            <Typography
              style={
                [
                  styles.exportSectionTitles,
                  lightTheme && { color: Colors.primaryHeaderText },
                ] as TextStyle
              }>
              {headline as string}
            </Typography>
            <View style={{ height: 8 }} />
            <Typography
              style={
                [
                  styles.contentText,
                  lightTheme && { color: Colors.primaryText },
                ] as TextStyle
              }>
              {body}
            </Typography>
            {bodyLinkText && (
              <TouchableOpacity onPress={bodyLinkOnPress}>
                <Typography
                  style={{
                    color: Colors.linkTextInvert,
                    textDecorationLine: 'underline',
                  }}
                  use='body1'>
                  {bodyLinkText}
                </Typography>
              </TouchableOpacity>
            )}
          </ScrollView>

          <Button
            invert={!!lightTheme}
            style={{ marginTop: 10 }}
            label={nextButtonLabel}
            onPress={onNext}
            loading={buttonLoading}
          />

          {buttonSubtitle && (
            <Typography
              style={{ paddingTop: 10, color: Colors.white }}
              use='body3'>
              {buttonSubtitle as string}
            </Typography>
          )}
          {/* Add extra padding on the bottom if available for phone. 
           Interlays with the flexGrow on the scroll view to ensure that scrolling content has priority. */}
          {!ignoreModalStyling && (
            <View style={{ maxHeight: 20, flexGrow: 1 }} />
          )}
        </SafeAreaView>
      </BackgroundContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.faintGray,
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 12,
  },
  iconContainerCircle: {
    width: 70,
    height: 70,
    borderRadius: 70,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  exportSectionTitles: {
    ...TypographyStyles.header2,
    color: Colors.white,
  },
  contentText: {
    ...TypographyStyles.secondaryContent,
    color: Colors.white,
  },
});

export default ExportTemplate;
