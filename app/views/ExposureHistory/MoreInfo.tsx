import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { Typography } from '../../components/Typography';
import { NavigationBarWrapper } from '../../components/NavigationBarWrapper';
import { useStatusBarEffect } from '../../navigation';
import { useStrategyContent } from '../../TracingStrategyContext';

import { Spacing, Typography as TypographyStyles } from '../../styles';

const MoreInfo = (): JSX.Element => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  useStatusBarEffect('light-content');
  const { StrategyCopy } = useStrategyContent();

  const handleOnBackPress = () => {
    navigation.goBack();
  };

  return (
    <NavigationBarWrapper
      title={t('screen_titles.more_info')}
      onBackPress={handleOnBackPress}>
      <ScrollView style={styles.container}>
        <View style={styles.contentContainer}>
          <Typography style={styles.headerText}>
            {t('exposure_history.why_did_i_get_an_en')}
          </Typography>
          <Typography style={styles.contentText}>
            {StrategyCopy.moreInfoWhyContent}
          </Typography>
        </View>
        <View style={styles.contentContainer}>
          <Typography style={styles.headerText}>
            {t('exposure_history.how_does_this_work')}
          </Typography>
          <Typography style={styles.contentText}>
            {StrategyCopy.moreInfoHowContent}
          </Typography>
        </View>
      </ScrollView>
    </NavigationBarWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.medium,
  },
  headerText: {
    ...TypographyStyles.header3,
  },
  contentContainer: {
    paddingBottom: Spacing.xLarge,
  },
  contentText: {
    ...TypographyStyles.mainContent,
    paddingTop: Spacing.small,
  },
});

export default MoreInfo;
