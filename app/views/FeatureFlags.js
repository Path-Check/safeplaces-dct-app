/* eslint-disable react-native/no-raw-text */
import React, { useEffect, useState } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';

import NavigationBarWrapper from '../components/NavigationBarWrapper';
import { Switch } from '../components/Switch';
import { Typography } from '../components/Typography';
import Colors from '../constants/colors';
import { DEBUG_MODE } from '../constants/storage';
import { buildTimeFlags, useFlags } from '../helpers/flags';
import { GetStoreData } from '../helpers/General';
import { disableDebugMode, enableDebugMode } from '../helpers/Intersect';

export const FeatureFlagsScreen = ({ navigation }) => {
  const [flags, setFlag] = useFlags();
  const [isExposed, setIsExposed] = useState(false);

  useEffect(() => {
    const handleBackPress = () => {
      navigation.goBack();
      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    (async () => {
      const isExposed = await GetStoreData(DEBUG_MODE, false);
      setIsExposed(isExposed);
    })();

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, [navigation]);

  const backToMain = () => {
    navigation.goBack();
  };

  const getBuildtimeFlagVal = flagName =>
    buildTimeFlags[flagName] ? 'On' : 'Off';

  const toggleExposureMode = val => {
    val ? enableDebugMode() : disableDebugMode();
    setIsExposed(val);
  };

  const toggleFlag = flagName => setFlag(flagName, !flags[flagName]);

  const getExposureModeToggle = () => (
    <View style={styles.toggleRow}>
      <Switch
        value={isExposed}
        onValueChange={toggleExposureMode}
        trackColor={{ false: Colors.GRAY_BACKGROUND, true: Colors.RED_TEXT }}
      />
      <Typography
        use={'body1'}
        bold
        style={
          isExposed
            ? { ...styles.toggleRowText, color: Colors.RED_TEXT }
            : styles.toggleRowText
        }>
        Exposure Mode
      </Typography>
    </View>
  );

  const getFlagToggleRow = ([flagName, isFlagActive]) => (
    <View key={flagName} style={styles.toggleRow}>
      <Switch value={isFlagActive} onValueChange={() => toggleFlag(flagName)} />
      <View style={styles.toggleRowText}>
        <Typography use={'body1'} bold>{`${flagName}`}</Typography>
        <Typography use={'body2'}>
          Default:
          <Typography
            style={styles.toggleDefaultVal}
            use={'body3'}>{` ${getBuildtimeFlagVal(flagName)}`}</Typography>
        </Typography>
      </View>
    </View>
  );

  const getFlagToggleList = flags => (
    <View style={styles.toggleList}>
      {getExposureModeToggle()}
      {Object.entries(flags).map(entry => getFlagToggleRow(entry))}
    </View>
  );

  return (
    <NavigationBarWrapper title={'Feature Flags'} onBackPress={backToMain}>
      <Typography use={'body1'} style={styles.headerText} bold>
        Notice
      </Typography>
      <Typography use={'body2'} style={styles.headerText}>
        This screen is only available when running the application in
        development or testing
      </Typography>
      {getFlagToggleList(flags)}
    </NavigationBarWrapper>
  );
};

const styles = StyleSheet.create({
  headerText: {
    textAlign: 'center',
    paddingTop: 7.5,
    marginHorizontal: 15,
  },
  toggleList: {
    paddingTop: 20,
    marginHorizontal: 10,
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
  toggleDefaultVal: {
    fontStyle: 'italic',
  },
});
