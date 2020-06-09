import React, { useEffect } from 'react';
import { Alert, BackHandler, ScrollView } from 'react-native';

import { NavigationBarWrapper } from '../../components';
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

export const EN_DEBUG_MENU_SCREEN_NAME = 'ENDebugMenu';
export const EN_LOCAL_DIAGNOSIS_KEYS_SCREEN_NAME = 'ENLocalDiagnosisKeyScreen';

export const ENDebugMenu = ({ navigation }) => {
  useEffect(() => {
    const handleBackPress = () => {
      navigation.goBack();
    };

    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, [navigation]);

  const backToSettings = () => {
    navigation.goBack();
  };

  const showErrorAlert = (errorString) => {
    Alert.alert('Error', errorString, [{ text: 'OK' }], { cancelable: false });
  };

  const showSuccessAlert = (messageString) => {
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
    callSimulatedEvent,
    successMessage,
  ) => {
    return () => {
      const cb = (errorString) => {
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
    <NavigationBarWrapper title={'EN Debug Menu'} onBackPress={backToSettings}>
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
