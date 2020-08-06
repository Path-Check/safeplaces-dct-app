import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableWithoutFeedback,
} from 'react-native';

import { NavigationBarWrapper, Typography } from '../components';

import { useDispatch } from 'react-redux';
import toggleAllowFeatureFlagsAction from '../store/actions/featureFlags/toggleAllowFeatureFlagsEnabledAction';
import { Colors, Spacing, Typography as TypographyStyles } from '../styles';
import getAppVersion from '../helpers/getAppVersion';

const CLICKS_TO_ENABLE_FEATURE_FLAGS = 10;

export const AboutScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const [clickCount, setClickCount] = useState(0);
  useEffect(() => {
    if (clickCount === CLICKS_TO_ENABLE_FEATURE_FLAGS) {
      Alert.alert('Feature Flags Enabled!');
      dispatch(toggleAllowFeatureFlagsAction({ overrideValue: true }));
    }
  }, [clickCount, dispatch]);

  const incrementClickCount = () => setClickCount(clickCount + 1);

  const { t } = useTranslation();

  const backToMain = () => {
    navigation.goBack();
  };

  return (
    <NavigationBarWrapper
      title={t('screen_titles.about')}
      onBackPress={backToMain}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        alwaysBounceVertical={false}>
        <TouchableWithoutFeedback
          touchSoundDisabled
          onPress={incrementClickCount}>
          <View>
            <Typography use='headline2' style={styles.heading}>
              {t('label.about_header_location')}
            </Typography>
          </View>
        </TouchableWithoutFeedback>
        <Typography use='body2'>{t('label.about_para')}</Typography>
        <Typography
          style={styles.hyperlink}
          onPress={() => {
            Linking.openURL('https://pathcheck.org/');
          }}>
          <Text>{'pathcheck.org'}</Text>
        </Typography>

        <View style={styles.rowContainer}>
          <View style={styles.row}>
            <Typography style={styles.aboutSectionParaLabel}>
              {t('about.version')}
            </Typography>

            <Typography style={styles.aboutSectionParaContent}>
              {getAppVersion()}
            </Typography>
          </View>
          <View style={styles.row}>
            <Typography style={styles.aboutSectionParaLabel}>
              {t('about.operating_system_abbr')}
            </Typography>
            <Typography style={styles.aboutSectionParaContent}>
              {Platform.OS + ' v' + Platform.Version}
            </Typography>
          </View>
        </View>
      </ScrollView>
    </NavigationBarWrapper>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: Colors.primaryBackground,
    paddingHorizontal: Spacing.medium,
    paddingTop: Spacing.huge,
  },
  heading: {
    marginBottom: Spacing.small,
  },
  hyperlink: {
    color: Colors.linkText,
    textDecorationLine: 'underline',
  },
  aboutSectionParaLabel: {
    ...TypographyStyles.header5,
    width: Spacing.xxxHuge * 2,
    marginTop: Spacing.small,
  },
  aboutSectionParaContent: {
    ...TypographyStyles.mainContent,
    marginTop: Spacing.small,
  },
  rowContainer: {
    marginTop: Spacing.medium,
  },
  row: {
    flexDirection: 'row',
  },
});

export default AboutScreen;
