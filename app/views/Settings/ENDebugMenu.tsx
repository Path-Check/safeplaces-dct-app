import React, { useEffect } from 'react';
import {
  View,
  ViewStyle,
  TouchableOpacity,
  StyleSheet,
  Alert,
  BackHandler,
  ScrollView,
} from 'react-native';

import { NavigationBarWrapper } from '../../components/NavigationBarWrapper';
import { Typography } from '../../components/Typography';
import { BTNativeModule } from '../../bt';
import { NavigationProp, Screens } from '../../navigation';

import { Colors, Spacing } from '../../styles';

// eslint-disable-next-line
declare const global: any;

type ENDebugMenuProps = {
  navigation: NavigationProp;
};

const ENDebugMenu = ({ navigation }: ENDebugMenuProps): JSX.Element => {
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

  const backToSettings = () => {
    navigation.goBack();
  };

  const showErrorAlert = (errorString: string) => {
    Alert.alert('Error', errorString, [{ text: 'OK' }], {
      cancelable: false,
    });
  };

  const showSuccessAlert = (messageString: string) => {
    Alert.alert(
      'Success',
      messageString,
      [
        {
          text: 'OK',
        },
      ],
      { cancelable: false },
    );
  };

  const handleOnPressSimulationButton = (
    callSimulatedEvent: (
      cb: (errorString: string | null, successString: string | null) => void,
    ) => void,
  ) => {
    return () => {
      const cb = (errorString: string | null, successString: string | null) => {
        if (errorString) {
          showErrorAlert(errorString);
        } else if (successString) {
          showSuccessAlert(successString);
        } else {
          showSuccessAlert('success');
        }
      };
      callSimulatedEvent(cb);
    };
  };

  const handleOnPressToggleExposureNotifications = () => {
    handleOnPressSimulationButton(BTNativeModule.toggleExposureNotifications)();
    global.ExposureNotificationsOn = !global.ExposureNotificationsOn;
  };

  interface DebugMenuListItemProps {
    label: string;
    onPress: () => void;
    style?: ViewStyle;
  }

  const DebugMenuListItem = ({
    label,
    onPress,
    style,
  }: DebugMenuListItemProps) => {
    return (
      <TouchableOpacity style={[styles.listItem, style]} onPress={onPress}>
        <Typography use={'body1'}>{label}</Typography>
      </TouchableOpacity>
    );
  };

  return (
    <NavigationBarWrapper
      includeBottomNav
      title={'EN Debug Menu'}
      onBackPress={backToSettings}>
      <ScrollView>
        <View style={styles.section}>
          <DebugMenuListItem
            label='Reset Exposures'
            style={styles.lastListItem}
            onPress={handleOnPressSimulationButton(
              BTNativeModule.resetExposures,
            )}
          />
        </View>
        <View style={styles.section}>
          <DebugMenuListItem
            label='Detect Exposures Now'
            onPress={handleOnPressSimulationButton(
              BTNativeModule.detectExposuresNow,
            )}
          />
          <DebugMenuListItem
            label='Simulate Exposure Detection Error'
            onPress={handleOnPressSimulationButton(
              BTNativeModule.simulateExposureDetectionError,
            )}
          />
          <DebugMenuListItem
            label='Simulate Exposure'
            onPress={handleOnPressSimulationButton(
              BTNativeModule.simulateExposure,
            )}
          />
          <DebugMenuListItem
            label='Simulate Positive Diagnosis'
            onPress={handleOnPressSimulationButton(
              BTNativeModule.simulatePositiveDiagnosis,
            )}
          />
          <DebugMenuListItem
            label='Toggle Exposure Notifications'
            onPress={handleOnPressToggleExposureNotifications}
          />
          <DebugMenuListItem
            label='Reset Exposure Detection Error'
            onPress={handleOnPressSimulationButton(
              BTNativeModule.resetExposureDetectionError,
            )}
          />
          <DebugMenuListItem
            label='Reset User EN State'
            style={styles.lastListItem}
            onPress={handleOnPressSimulationButton(
              BTNativeModule.resetUserENState,
            )}
          />
        </View>
        <View style={styles.section}>
          <DebugMenuListItem
            label='Show Local Diagnosis Keys'
            onPress={() => {
              navigation.navigate(Screens.ENLocalDiagnosisKey);
            }}
          />
          <DebugMenuListItem
            label='Get and Post Diagnosis Keys'
            style={styles.lastListItem}
            onPress={handleOnPressSimulationButton(
              BTNativeModule.getAndPostDiagnosisKeys,
            )}
          />
        </View>
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
  listItem: {
    flex: 1,
    paddingVertical: Spacing.medium,
    borderBottomWidth: 1,
    borderColor: Colors.tertiaryViolet,
  },
  lastListItem: {
    borderBottomWidth: 0,
  },
});

export default ENDebugMenu;
