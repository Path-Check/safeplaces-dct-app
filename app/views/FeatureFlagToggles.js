/* eslint-disable react-native/no-raw-text */
import React from 'react';
import { StyleSheet, View, FlatList } from 'react-native';

import { NavigationBarWrapper, Switch, Typography } from '../components';
import { useDispatch, useSelector } from 'react-redux';
import toggleFeatureFlagAction from '../store/actions/featureFlags/toggleFeatureFlagAction';
import { Spacing } from '../styles';
import { FeatureFlagOption } from '../store/types';

const flagToName = (flag) => {
  switch (flag) {
    case FeatureFlagOption.CUSTOM_URL:
      return 'Custom Yaml URL';
    case FeatureFlagOption.DOWNLOAD_LOCALLY:
      return 'Download Locally';
    case FeatureFlagOption.GOOGLE_IMPORT:
      return 'Import from Google';
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

  return (
    <NavigationBarWrapper
      title={'Feature Flags'}
      onBackPress={() => navigation.goBack()}>
      <View style={{ padding: Spacing.large }}>
        <Typography use='body1' style={styles.headerText} bold>
          Notice
        </Typography>
        <Typography use='body2' style={styles.headerText}>
          This screen is for enabling advanced debugging features
        </Typography>
        <View style={{ height: Spacing.large }} />
        <FlatList
          data={flags}
          keyExtractor={(_, i) => `${i}`}
          renderItem={({ item: flag }) => <FlagToggleRow flag={flag} />}
        />
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
