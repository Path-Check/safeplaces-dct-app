import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { Typography } from '../../components/Typography';
import { NavigationBarWrapper } from '../../components/NavigationBarWrapper';
import { useStatusBarEffect } from '../../navigation';

import { Spacing, Typography as TypographyStyles } from '../../styles';

const MoreInfo = (): JSX.Element => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  useStatusBarEffect('light-content');

  const handleOnBackPress = () => {
    navigation.goBack();
  };

  const headerTextOne = t('exposure_history.why_did_i_get_an_en');
  const contentTextOne = t('exposure_history.why_did_i_get_an_en_para');

  const headerTextTwo = t('exposure_history.how_does_this_work');
  const contentTextTwo = t('exposure_history.how_does_this_work_para');

  const title = 'More Info';

  return (
    <NavigationBarWrapper
      includeBottomNav
      title={title}
      onBackPress={handleOnBackPress}>
      <ScrollView
        style={styles.container}
        contentInset={{ top: 0, bottom: 140 }}>
        <View style={styles.contentContainer}>
          <Typography style={styles.headerText}>{headerTextOne}</Typography>
          <Typography style={styles.contentText}>{contentTextOne}</Typography>
        </View>
        <View style={styles.contentContainer}>
          <Typography style={styles.headerText}>{headerTextTwo}</Typography>
          <Typography style={styles.contentText}>{contentTextTwo}</Typography>
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
