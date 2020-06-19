import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { Typography } from '../../components/Typography';
import { NavigationBarWrapper } from '../../components/NavigationBarWrapper';
import { useStatusBarEffect } from '../../navigation';

import { Spacing, Typography as TypographyStyles } from '../../styles';
import { isGPS } from '../../COVIDSafePathsConfig';

const MoreInfo = (): JSX.Element => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  useStatusBarEffect('light-content');

  const handleOnBackPress = () => {
    navigation.goBack();
  };

  const headerTextOne = isGPS
    ? t('exposure_history.more_info_gps.why_did_i_get_an_en')
    : t('exposure_history.more_info_bt.why_did_i_get_an_en');

  const contentTextOne = isGPS
    ? t('exposure_history.more_info_gps.why_did_i_get_an_en_para')
    : t('exposure_history.more_info_bt.why_did_i_get_an_en_para');

  const headerTextTwo = isGPS
    ? t('exposure_history.more_info_gps.how_does_this_work')
    : t('exposure_history.more_info_bt.how_does_this_work');

  const contentTextTwo = isGPS
    ? t('exposure_history.more_info_gps.how_does_this_work_para')
    : t('exposure_history.more_info_bt.how_does_this_work_para');

  const title = 'More Info';

  return (
    <NavigationBarWrapper title={title} onBackPress={handleOnBackPress}>
      <ScrollView style={styles.container}>
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
