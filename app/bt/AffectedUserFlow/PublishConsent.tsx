import React, { useState } from 'react';
import {
  ScrollView,
  ImageBackground,
  StyleSheet,
  View,
  SafeAreaView,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import { Button } from '../../components/Button';
import { Typography } from '../../components/Typography';
import { useStrategyContent } from '../../TracingStrategyContext';
import { useStatusBarEffect } from '../../navigation';
import * as BTNativeModule from '../nativeModule';

import { Screens } from '../../navigation';
import { Images } from '../../assets';
import {
  Layout,
  Colors,
  Spacing,
  Iconography,
  Typography as TypographyStyles,
} from '../../styles';

const PublishConsent = (): JSX.Element => {
  useStatusBarEffect('dark-content');
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const { StrategyCopy, StrategyAssets } = useStrategyContent();

  const handleOnPressConfirm = async () => {
    setIsLoading(true);
    const cb = (_errorMessage: string, _successMessage: string) => {
      navigation.navigate(Screens.AffectedUserComplete);
      setIsLoading(false);
    };
    BTNativeModule.submitDiagnosisKeys(cb);
  };

  const title = StrategyCopy.exportPublishTitle;
  const body = t('export.publish_consent_body_bluetooth');

  return (
    <ImageBackground
      source={Images.BlueGradientBackground}
      style={styles.backgroundImage}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.contentContainer}>
          <View style={styles.icon}>
            <SvgXml
              xml={StrategyAssets.exportPublishIcon}
              width={Iconography.small}
              height={Iconography.small}
            />
          </View>

          <View style={styles.content}>
            <Typography style={styles.header}>{title}</Typography>
            <Typography style={styles.contentText}>{body}</Typography>
          </View>

          <Button
            label={t('export.consent_button_title')}
            onPress={handleOnPressConfirm}
            loading={isLoading}
          />
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingTop: Layout.oneTenthHeight,
    paddingHorizontal: Spacing.large,
    paddingBottom: Spacing.huge,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  content: {
    paddingBottom: Spacing.xHuge,
  },
  header: {
    ...TypographyStyles.header2,
    color: Colors.white,
    paddingBottom: Spacing.medium,
  },
  icon: {
    ...Iconography.largeIcon,
    backgroundColor: Colors.white,
  },
  contentText: {
    ...TypographyStyles.secondaryContent,
    color: Colors.white,
  },
});

export default PublishConsent;
