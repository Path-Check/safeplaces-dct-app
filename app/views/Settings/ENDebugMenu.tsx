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
  resetUserENState,
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

  return (
    <NavigationBarWrapper title={'EN Debug Menu'} onBackPress={backToSettings}>
      <ScrollView>
        <Section>
          <Item
            label='Detect Exposures Now'
            onPress={handleOnPressSimulationButton(detectExposuresNow)}
          />
          <Item
            label='Get Exposure Configuration'
            onPress={handleOnPressSimulationButton(getExposureConfiguration)}
          />
          <Item
            label='Simulate Exposure Detection Error'
            onPress={handleOnPressSimulationButton(
              simulateExposureDetectionError,
            )}
          />
          <Item
            label='Simulate Exposure'
            onPress={handleOnPressSimulationButton(simulateExposure)}
          />
          <Item
            label='Simulate Positive Diagnosis'
            onPress={handleOnPressSimulationButton(simulatePositiveDiagnosis)}
          />
          <Item
            label='Disable Exposure Notifications'
            onPress={handleOnPressSimulationButton(
              disableExposureNotifications,
            )}
          />
          <Item
            label='Reset Exposure Detection Error'
            onPress={handleOnPressSimulationButton(resetExposureDetectionError)}
          />
          <Item
            label='Reset User EN State'
            onPress={handleOnPressSimulationButton(resetUserENState)}
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
            onPress={handleOnPressSimulationButton(getAndPostDiagnosisKeys)}
            last
          />
        </Section>
      </ScrollView>
    </NavigationBarWrapper>
  );
};
