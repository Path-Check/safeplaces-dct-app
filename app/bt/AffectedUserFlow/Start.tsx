import React from 'react';
import {
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  View,
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { SvgXml } from 'react-native-svg';

import { Typography } from '../../components/Typography';
import { Button } from '../../components/Button';
import { useStatusBarEffect } from '../../navigation';

import { Screens } from '../../navigation';

import { Images, Icons } from '../../assets';
import {
  Iconography,
  Spacing,
  Colors,
  Typography as TypographyStyles,
} from '../../styles';

export const ExportIntro = (): JSX.Element => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  useStatusBarEffect('dark-content');

  const handleOnPressNext = () => {
    navigation.navigate(Screens.AffectedUserCodeInput);
  };

  const title = t('export.start_body_bluetooth');
  const body = t('export.start_title_bluetooth');

  return (
    <ImageBackground
      source={Images.BlueGradientBackground}
      style={styles.backgroundImage}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          style={styles.container}>
          <View style={styles.headerContainer}>
            <View style={styles.iconContainerCircle}>
              <SvgXml
                xml={Icons.Heart}
                width={Iconography.small}
                height={Iconography.small}
              />
            </View>

            <Typography style={styles.header}>{title}</Typography>
            <Typography style={styles.contentText}>{body}</Typography>
          </View>

          <Button label={t('common.start')} onPress={handleOnPressNext} />
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  container: {
    padding: Spacing.large,
  },
  contentContainer: {
    justifyContent: 'space-between',
    paddingBottom: Spacing.xxHuge,
  },
  headerContainer: {
    marginBottom: Spacing.xxHuge,
  },
  header: {
    ...TypographyStyles.header2,
    color: Colors.white,
  },
  iconContainerCircle: {
    ...Iconography.largeIcon,
    backgroundColor: Colors.white,
  },
  contentText: {
    ...TypographyStyles.secondaryContent,
    color: Colors.white,
    paddingTop: Spacing.medium,
  },
});

export default ExportIntro;
