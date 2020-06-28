import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  TextStyle,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { BackHandler } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { Button } from '../../components/Button';
import { IconButton } from '../../components/IconButton';
import { Typography } from '../../components/Typography';

import { Icons } from '../../assets';
import { Colors, Typography as TypographyStyles } from '../../styles';
import { useStatusBarEffect } from '../../navigation';
import { useFocusEffect } from '@react-navigation/native';

interface BackgroundContainerProps {
  children: JSX.Element;
}

const BackgroundContainer = ({
  children,
}: BackgroundContainerProps): JSX.Element => {
  return <View style={styles.container}>{children}</View>;
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
  buttonLoading,
  // We can consider instead using the trans component:
  // https://react.i18next.com/latest/trans-component
  bodyLinkText,
  bodyLinkOnPress,
  ignoreModalStyling, // So first screen can be slightly different in tabs
}: ExportTemplateProps): JSX.Element => {
  useStatusBarEffect('dark-content');
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
    <BackgroundContainer>
      <SafeAreaView style={{ flex: 1, marginBottom: 24 }}>
        {onClose && (
          <View style={styles.header}>
            <IconButton icon={Icons.Close} size={22} onPress={onClose} />
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
                { color: Colors.primaryHeaderText },
              ] as TextStyle
            }>
            {headline as string}
          </Typography>
          <View style={{ height: 8 }} />
          <Typography
            style={
              [styles.contentText, { color: Colors.primaryText }] as TextStyle
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
        {!ignoreModalStyling && <View style={{ maxHeight: 20, flexGrow: 1 }} />}
      </SafeAreaView>
    </BackgroundContainer>
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
