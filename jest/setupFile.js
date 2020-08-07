import mockAsyncStorage from '@react-native-community/async-storage/jest/async-storage-mock';
import { NativeModules } from 'react-native';

// Device locale mocks
NativeModules.SettingsManager = NativeModules.SettingsManager || {
  settings: { AppleLocale: 'en_US' },
  I18nManager: { localeIdentifier: 'en_US' },
};

// Secure storage manager
NativeModules.SecureStorageManager = NativeModules.SecureStorageManager || {
  getLocations: jest.fn(),
  migrateExistingLocations: jest.fn(),
};

// Exposure event emitter
NativeModules.ExposureEventEmitter = NativeModules.ExposureEventEmitter || {
  startListening: jest.fn(),
  addListener: jest.fn(),
};

jest.mock('react-native-pulse');
jest.mock('react-native-linear-gradient');
jest.mock('@mauron85/react-native-background-geolocation');
jest.mock('@react-native-community/geolocation', () => ({
  getCurrentPosition: () => {},
}));

// Silence YellowBox useNativeDriver warning
jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');

jest.mock('@react-native-community/async-storage', () => mockAsyncStorage);
jest.mock(
  '@react-native-community/push-notification-ios',
  () => 'push-notification-ios',
);
jest.mock('react-native-share', () => 'Share');
jest.mock('rn-fetch-blob', () => 'Blob');
jest.mock('react-native-background-timer', () => ({
  runBackgroundTimer: () => {},
  stopBackgroundTimer: () => {},
}));

jest.mock('redux-persist', () => ({
  createMigrate: () => {},
  persistReducer: () => {},
  persistStore: () => {},
}));

jest.mock('redux-devtools-extension', () => ({
  composeWithDevTools: () => {},
}));

jest.mock('@react-navigation/stack', () => {
  return {
    createStackNavigator: () => {
      return {
        Screen: jest.fn(),
        Stack: jest.fn(),
        Navigator: jest.fn(),
      };
    },
    CardStyleInterpolators: {
      forHorizontalIOS: jest.fn(),
    },
  };
});
