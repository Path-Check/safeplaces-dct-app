import React from 'react';
import {
  ScrollView,
  ImageBackground,
  StyleSheet,
  View,
  SafeAreaView,
} from 'react-native';
import { SvgXml } from 'react-native-svg';

import { Button } from '../../components/Button';
import { Typography } from '../../components/Typography';
import { useStatusBarEffect } from '../../navigation';

import { Images } from '../../assets';
import {
  Spacing,
  Layout,
  Colors,
  Typography as TypographyStyles,
} from '../../styles';

interface ExportTemplateProps {
  headline: string;
  body: string;
  onNext: () => void;
  nextButtonLabel: string;
  icon?: string;
  buttonLoading?: boolean;
  ignoreModalStyling?: boolean; // So first screen can be slightly different in tabs
}

export const ExportTemplate = ({
  headline,
  body,
  onNext,
  nextButtonLabel,
  icon,
  buttonLoading,
  ignoreModalStyling, // So first screen can be slightly different in tabs
}: ExportTemplateProps): JSX.Element => {
  useStatusBarEffect('dark-content');

  return (
    <ImageBackground
      source={Images.BlueGradientBackground}
      style={styles.backgroundImage}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <ScrollView
            alwaysBounceVertical={false}
            style={{ flexGrow: 1 }}
            contentContainerStyle={{
              justifyContent: icon ? undefined : 'center',
              flexGrow: 1,
              paddingBottom: 24,
            }}>
            {icon && (
              <View style={styles.iconContainerCircle}>
                <SvgXml xml={icon as string} width={30} height={30} />
              </View>
            )}

            <Typography style={styles.header}>{headline}</Typography>
            <Typography style={styles.contentText}>{body}</Typography>
          </ScrollView>

          <Button
            style={{ marginTop: 10 }}
            label={nextButtonLabel}
            onPress={onNext}
            loading={buttonLoading}
          />

          {/* Add extra padding on the bottom if available for phone. 
           Interlays with the flexGrow on the scroll view to ensure that scrolling content has priority. */}
          {!ignoreModalStyling && (
            <View style={{ maxHeight: 20, flexGrow: 1 }} />
          )}
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Layout.oneTenthHeight,
    paddingHorizontal: Spacing.large,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    flex: 1,
  },
  header: {
    ...TypographyStyles.header2,
    color: Colors.white,
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
  contentText: {
    ...TypographyStyles.secondaryContent,
    color: Colors.white,
  },
});

export default ExportTemplate;
