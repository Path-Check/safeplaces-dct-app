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
} from '../../exposureNotificationsNativeModule';

export const EN_DEBUG_MENU_SCREEN_NAME = 'ENDebugMenu';

export const ENDebugMenu = ({ navigation }) => {
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

  const showErrorAlert = (errorString) => {
    Alert.alert(
      'Error',
      errorString,
      [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
      { cancelable: false },
    );
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
  return (
    <NavigationBarWrapper title={'EN Debug Menu'} onBackPress={backToSettings}>
      <ScrollView>
        <Section>
          <Item
            label='Detect Exposures Now'
            onPress={() => {
              const cb = (errorString) => {
                if (errorString != null) {
                  showErrorAlert(errorString);
                } else {
                  showSuccessAlert('Exposure detection successful.');
                }
              };
              detectExposuresNow(cb);
            }}
          />
          <Item
            label='Simulate Exposure Detection Error'
            onPress={() => {
              const cb = (errorString) => {
                if (errorString != null) {
                  showErrorAlert(errorString);
                } else {
                  showErrorAlert(
                    'There was a problem simulating exposure detection error.',
                  );
                }
              };
              simulateExposureDetectionError(cb);
            }}
          />
          <Item
            label='Simulate Exposure'
            onPress={() => {
              const cb = (errorString) => {
                if (errorString != null) {
                  showErrorAlert(errorString);
                } else {
                  showSuccessAlert('Exposure simulation successful.');
                }
              };
              simulateExposure(cb);
            }}
          />
          <Item
            label='Simulate Positive Diagnosis'
            onPress={() => {
              const cb = (errorString) => {
                if (errorString != null) {
                  showErrorAlert(errorString);
                } else {
                  showSuccessAlert('Positive diagnosis simulation successful.');
                }
              };
              simulatePositiveDiagnosis(cb);
            }}
          />
          <Item
            label='Disable Exposure Notifications'
            onPress={() => {
              const cb = (errorString) => {
                if (errorString != null) {
                  showErrorAlert(errorString);
                } else {
                  showSuccessAlert('Exposure Notifications disabled.');
                }
              };
              disableExposureNotifications(cb);
            }}
          />
          <Item
            label='Reset Exposure Detection Error'
            onPress={() => {
              const cb = (errorString) => {
                if (errorString != null) {
                  showErrorAlert(errorString);
                } else {
                  showSuccessAlert('Reset Successful.');
                }
              };
              resetExposureDetectionError(cb);
            }}
          />
          <Item
            label='Reset Local Exposures'
            onPress={() => {
              const cb = (errorString) => {
                if (errorString != null) {
                  showErrorAlert(errorString);
                } else {
                  showSuccessAlert('Reset Successful.');
                }
              };
              resetLocalExposures(cb);
            }}
            last
          />
        </Section>
        <Section last>
          <Item
            label='Show Diagnosis Keys'
            onPress={() => {
              showErrorAlert('Not Yet Implemented.');
            }}
          />
          <Item
            label='Get and Post Diagnosis Keys'
            onPress={() => {
              const cb = (errorString) => {
                if (errorString != null) {
                  showErrorAlert(errorString);
                } else {
                  showSuccessAlert('Diagnosis keys successfully posted.');
                }
              };
              getAndPostDiagnosisKeys(cb);
            }}
          />
        </Section>
      </ScrollView>
    </NavigationBarWrapper>
  );
};
