/* eslint-disable react-native/no-raw-text */
import React, { useEffect, useState } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';

import { NavigationBarWrapper, Switch, Typography } from '../components';
import Colors from '../constants/colors';
import { getBuildtimeFlags } from '../constants/flagsEnv';
import { DEBUG_MODE } from '../constants/storage';
import { Theme } from '../constants/themes';
import { getCleanedFlagName } from '../helpers/Flags';
import { GetStoreData } from '../helpers/General';
import { disableDebugMode, enableDebugMode } from '../helpers/Intersect';
import { useFlags } from '../services/hooks/useFlags';

export const FEATURE_FLAG_SCREEN_NAME = 'FeatureFlagsScreen';

export const FlagToggleRow = ({ name, val, onValueChange }) => {
  const buildtimeFlags = getBuildtimeFlags();

  const getBuildtimeFlagVal = (flagName) =>
    buildtimeFlags[flagName] ? 'On' : 'Off';

  return (
    <View style={styles.toggleRow}>
      <Switch
        testID={name}
        value={val}
        onValueChange={() => onValueChange(name)}
      />
      <View style={styles.toggleRowText}>
        <Typography use='body1' bold>
          {`${getCleanedFlagName(name)}`}
        </Typography>
        <Typography use='body2'>
          Default:
          <Typography style={styles.toggleDefaultVal} use='body3'>
            {` ${getBuildtimeFlagVal(name)}`}
          </Typography>
        </Typography>
      </View>
    </View>
  );
};

export const ExposureModeToggleRow = () => {
  const [isExposed, setIsExposed] = useState(false);

  useEffect(() => {
    const setInitalExposureVal = async () => {
      const isExposed = await GetStoreData(DEBUG_MODE, false);
      setIsExposed(isExposed);
    };
    setInitalExposureVal();
  }, []);

  const toggleExposureMode = (val) => {
    val ? enableDebugMode() : disableDebugMode();
    setIsExposed(val);
  };

  return (
    <View style={styles.toggleRow}>
      <Switch
        value={isExposed}
        onValueChange={toggleExposureMode}
        trackColor={{ false: Colors.GRAY_BACKGROUND, true: Colors.RED_TEXT }}
      />
      <Typography
        use='body1'
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
};

export const FlagToggleList = () => {
  const [flags, setFlag] = useFlags();
  const alphabetizedFlags = Object.keys(flags).sort(); // Prevents toggle reordering

  const toggleFlag = async (key) => setFlag(key, !flags[key]);

  return (
    <View style={styles.toggleList}>
      <ExposureModeToggleRow />
      {alphabetizedFlags.map((key) => {
        return (
          <FlagToggleRow
            key={key}
            name={key}
            val={flags[key]}
            onValueChange={toggleFlag}
          />
        );
      })}
    </View>
  );
};

export const FeatureFlagsScreen = ({ navigation }) => {
  useEffect(() => {
    const handleBackPress = () => {
      navigation.goBack();
      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, [navigation]);

  const backToMain = () => {
    navigation.goBack();
  };

  return (
    <NavigationBarWrapper title={'Feature Flags'} onBackPress={backToMain}>
      <Theme use='default'>
        <Typography use='body1' style={styles.headerText} bold>
          Notice
        </Typography>
        <Typography use='body2' style={styles.headerText}>
          This screen is only available when running the application in
          development or testing
        </Typography>
        <FlagToggleList />
      </Theme>
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
    width: '80%',
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
