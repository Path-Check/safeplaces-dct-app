import React, { useEffect } from 'react';
import { Alert, BackHandler, ScrollView } from 'react-native';

import { NavigationBarWrapper } from '../../components/NavigationBarWrapper';
import { Item } from './Item';
import { Section } from './Section';
import {
  detectExposuresNow,
  simulateExposure,
  simulatePositiveDiagnosis,
  disableExposureNotifications,
  resetExposureDetectionError,
  resetLocalExposures,
  getAndPostDiagnosisKeys,
  simulateExposureDetectionError,
  getExposureConfiguration,
} from '../../exposureNotificationsNativeModule';
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
} from 'react-navigation';

type ENDebugMenuProps = {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
};

export const EN_DEBUG_MENU_SCREEN_NAME = 'ENDebugMenu';
export const EN_LOCAL_DIAGNOSIS_KEYS_SCREEN_NAME = 'ENLocalDiagnosisKeyScreen';

export const ENDebugMenu = ({ navigation }: ENDebugMenuProps): JSX.Element => {
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
    callSimulatedEvent: (cb: (errorString: string | null) => void) => void,
    successMessage: string,
  ) => {
    return () => {
      const cb = (errorString: string | null) => {
        if (errorString) {
          showErrorAlert(errorString);
        } else {
          showSuccessAlert(successMessage);
        }
      };
      callSimulatedEvent(cb);
    };
  };

  return (
    <NavigationBarWrapper
      includeBottomNav
      title={'EN Debug Menu'}
      onBackPress={backToSettings}>
      <ScrollView>
        <Section>
          <Item
            label='Detect Exposures Now'
            onPress={handleOnPressSimulationButton(
              detectExposuresNow,
              'Exposure Detection Successful.',
            )}
          />
          <Item
            label='Get Exposure Configuration'
            onPress={handleOnPressSimulationButton(
              getExposureConfiguration,
              'Successfully Fetched Exposure Configuration',
            )}
          />
          <Item
            label='Simulate Exposure Detection Error'
            onPress={handleOnPressSimulationButton(
              simulateExposureDetectionError,
              'Exposure detection error simulation successful.',
            )}
          />
          <Item
            label='Simulate Exposure'
            onPress={handleOnPressSimulationButton(
              simulateExposure,
              'Exposure simulation successful.',
            )}
          />
          <Item
            label='Simulate Positive Diagnosis'
            onPress={handleOnPressSimulationButton(
              simulatePositiveDiagnosis,
              'Positive diagnosis simulation successful.',
            )}
          />
          <Item
            label='Disable Exposure Notifications'
            onPress={handleOnPressSimulationButton(
              disableExposureNotifications,
              'Exposure notifications disabled.',
            )}
          />
          <Item
            label='Reset Exposure Detection Error'
            onPress={handleOnPressSimulationButton(
              resetExposureDetectionError,
              'Reset successful.',
            )}
          />
          <Item
            label='Reset Local Exposures'
            onPress={handleOnPressSimulationButton(
              resetLocalExposures,
              'Reset successful.',
            )}
            last
          />
        </Section>
        <Section last>
          <Item
            label='Show Local Diagnosis Keys'
            onPress={() => {
              navigation.navigate(EN_LOCAL_DIAGNOSIS_KEYS_SCREEN_NAME);
            }}
          />
          <Item
            label='Get and Post Diagnosis Keys'
            onPress={handleOnPressSimulationButton(
              getAndPostDiagnosisKeys,
              'Diagnosis keys successfully posted.',
            )}
          />
        </Section>
      </ScrollView>
    </NavigationBarWrapper>
  );
};
