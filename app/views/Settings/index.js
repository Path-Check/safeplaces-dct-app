import React, { useState } from 'react';
import { TouchableOpacity, View, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SvgXml } from 'react-native-svg';

import {
  FeatureFlag,
  NativePicker,
  NavigationBarWrapper,
  Typography,
} from '../../components';
import { isGPS } from '../../COVIDSafePathsConfig';
import {
  LOCALE_LIST,
  setUserLocaleOverride,
  supportedDeviceLanguageOrEnglish,
} from '../../locales/languages';
import { GoogleMapsImport } from './GoogleMapsImport';
import { Screens } from '../../navigation';

import { Icons } from '../../assets';
import { Colors, Spacing, Typography as TypographyStyles } from '../../styles';

export const SettingsScreen = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const [userLocale, setUserLocale] = useState(
    supportedDeviceLanguageOrEnglish(),
  );

  const backToMain = () => {
    navigation.goBack();
  };

  const navigateTo = (screen) => {
    () => navigation.navigate(screen);
  };

  const localeChanged = async (locale) => {
    try {
      await setUserLocaleOverride(locale);
      setUserLocale(locale);
    } catch (e) {
      console.log('something went wrong in lang change', e);
    }
  };

  const LanguageSelectionListItem = ({ icon, label, onPress }) => {
    const iconStyle =
      i18n.dir() === 'rtl'
        ? { marginLeft: Spacing.xSmall }
        : { marginRight: Spacing.xSmall };

    const flexDirection = i18n.dir() === 'rtl' ? 'row-reverse' : 'row';

    return (
      <TouchableOpacity
        style={[styles.languageSelectionListItem, { flexDirection }]}
        onPress={onPress}>
        <SvgXml xml={icon} style={[styles.icon, iconStyle]} size={24} />
        <Typography use={'body1'}>{label}</Typography>
      </TouchableOpacity>
    );
  };

  const SettingsListItem = ({ label, onPress, description, style }) => {
    return (
      <TouchableOpacity style={[styles.listItem, style]} onPress={onPress}>
        <Typography use={'body1'}>{label}</Typography>
        {description ? (
          <Typography style={styles.descriptionText}>{description}</Typography>
        ) : null}
      </TouchableOpacity>
    );
  };

  return (
    <NavigationBarWrapper
      includeBackButton={false}
      title={t('screen_titles.more')}
      onBackPress={backToMain}>
      <ScrollView>
        <View style={styles.section}>
          <NativePicker
            items={LOCALE_LIST}
            value={userLocale}
            onValueChange={localeChanged}>
            {({ label, openPicker }) => (
              <LanguageSelectionListItem
                label={label || t('label.unknown')}
                icon={Icons.LanguagesIcon}
                onPress={openPicker}
              />
            )}
          </NativePicker>
        </View>

        {isGPS ? (
          <View style={styles.section}>
            <SettingsListItem
              label={t('label.choose_provider_title')}
              description={t('label.choose_provider_subtitle')}
              onPress={navigateTo('ChooseProviderScreen')}
            />
            <FeatureFlag
              name='export_e2e'
              fallback={
                <SettingsListItem
                  label={t('share.title')}
                  description={t('share.subtitle')}
                  onPress={navigateTo('ExportLocally')}
                  style={styles.lastListItem}
                />
              }>
              <SettingsListItem
                label={t('share.title')}
                description={t('share.subtitle')}
                onPress={navigateTo('ExportScreen')}
              />
            </FeatureFlag>
            <FeatureFlag name='google_import'>
              <View style={styles.section}>
                <GoogleMapsImport navigation={navigation} />
              </View>
            </FeatureFlag>
          </View>
        ) : (
          <View style={styles.section}>
            <SettingsListItem
              label={t('settings.report_positive_test')}
              onPress={navigateTo('ExportFlow')}
              description={t('settings.report_positive_test_description')}
              style={styles.lastListItem}
            />
          </View>
        )}

        <View style={styles.section}>
          <SettingsListItem
            label={t('screen_titles.about')}
            onPress={navigateTo(Screens.About)}
          />
          <SettingsListItem
            label={t('screen_titles.legal')}
            onPress={() => navigation.navigate(Screens.Licenses)}
            last={!__DEV__}
          />
        </View>

        {__DEV__ ? (
          <View style={styles.section}>
            <SettingsListItem
              label='EN Debug Menu'
              onPress={navigateTo(Screens.ENDebugMenu)}
            />
            <SettingsListItem
              label='Feature Flags (Dev mode only)'
              onPress={navigateTo(Screens.FeatureFlag)}
              style={styles.lastListItem}
            />
          </View>
        ) : null}
      </ScrollView>
    </NavigationBarWrapper>
  );
};

const styles = StyleSheet.create({
  section: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.small,
    marginBottom: Spacing.medium,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.tertiaryViolet,
  },
  icon: {
    maxWidth: Spacing.icon,
    maxHeight: Spacing.icon,
  },
  listItem: {
    flex: 1,
    paddingVertical: Spacing.medium,
    borderBottomWidth: 1,
    borderColor: Colors.tertiaryViolet,
  },
  languageSelectionListItem: {
    flex: 1,
    paddingVertical: Spacing.medium,
  },
  lastListItem: {
    borderBottomWidth: 0,
  },
  descriptionText: {
    ...TypographyStyles.description,
  },
});
