/* eslint-disable react-native/no-raw-text */
import React, { useEffect, useCallback, useRef } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';

import {
  NavigationBarWrapper,
  Switch,
  Typography,
  Button,
} from '../components';
import { useDispatch, useSelector } from 'react-redux';
import toggleFeatureFlagAction from '../store/actions/featureFlags/toggleFeatureFlagAction';
import { Spacing } from '../styles';
import { FeatureFlagOption } from '../store/types';
import { initDevLanguages, initProdLanguages } from '../locales/languages';
import toggleAllowFeatureFlagsAction from '../store/actions/featureFlags/toggleAllowFeatureFlagsEnabledAction';

const flagToName = (flag) => {
  switch (flag) {
    case FeatureFlagOption.CUSTOM_URL:
      return 'Custom Yaml URL';
    case FeatureFlagOption.DOWNLOAD_LOCALLY:
      return 'Download Locally';
    case FeatureFlagOption.GOOGLE_IMPORT:
      return 'Import from Google';
    case FeatureFlagOption.DEV_LANGUAGES:
      return 'All Language Options';
    // For development ease:
    default:
      return flag;
  }
};

export const FlagToggleRow = ({ flag }) => {
  const dispatch = useDispatch();
  const flags = useSelector((state) => state.featureFlags.flags);
  const isActive = flags[flag];
  const toggleActive = () =>
    dispatch(toggleFeatureFlagAction({ flag, overrideValue: !isActive }));
  return (
    <View style={styles.toggleRow}>
      <Switch value={isActive} onValueChange={toggleActive} />
      <View style={styles.toggleRowText}>
        <Typography use='body1' bold>
          {flagToName(flag)}
        </Typography>
      </View>
    </View>
  );
};

export const FeatureFlagsScreen = ({ navigation }) => {
  const flagMap = useSelector((state) => state.featureFlags.flags);
  const flags = Object.keys(flagMap);
  const devLanguagesEnabled = flagMap[FeatureFlagOption.DEV_LANGUAGES];
  const isLoaded = useRef(true);

  // Only runs when language flag is toggled
  const toggleLanguages = useCallback(() => {
    if (devLanguagesEnabled) {
      initDevLanguages();
    } else {
      initProdLanguages();
    }
  }, [devLanguagesEnabled]);

  // Dev languages requires an init step, not just conditional render
  useEffect(() => {
    if (isLoaded.current) {
      isLoaded.current = false;
      return;
    } else {
      toggleLanguages();
    }
  }, [toggleLanguages]);
  const dispatch = useDispatch();

  const disableFeatureFlags = () => {
    dispatch(toggleAllowFeatureFlagsAction({ overrideValue: false }));
    navigation.goBack();
  };

  return (
    <NavigationBarWrapper
      title={'Feature Flags'}
      onBackPress={() => navigation.goBack()}>
      <View style={{ padding: Spacing.large, flex: 1 }}>
        <Typography use='body1' style={styles.headerText} bold>
          Notice
        </Typography>
        <Typography use='body2' style={styles.headerText}>
          This screen is for enabling advanced debugging features
        </Typography>
        <View style={{ height: Spacing.large }} />
        <FlatList
          alwaysBounceVertical={false}
          data={flags}
          keyExtractor={(_, i) => `${i}`}
          renderItem={({ item: flag }) => <FlagToggleRow flag={flag} />}
        />
        <Button label='Disable Feature Flags' onPress={disableFeatureFlags} />
      </View>
    </NavigationBarWrapper>
  );
};

const styles = StyleSheet.create({
  headerText: {
    textAlign: 'center',
    paddingTop: 7.5,
    marginHorizontal: 15,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 5,
    justifyContent: 'flex-start',
  },
  toggleRowText: {
    paddingLeft: 15,
  },
});
