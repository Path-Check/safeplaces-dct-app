import mockAsyncStorage from '@react-native-community/async-storage/jest/async-storage-mock';
import { NativeModules } from 'react-native';

// Device locale mocks
NativeModules.SettingsManager = NativeModules.SettingsManager || {
  settings: { AppleLocale: 'en_US' },
  I18nManager: { localeIdentifier: 'en_US' },
};

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
jest.mock('react-native-popup-menu', () => ({
  Menu: 'Menu',
  MenuProvider: 'MenuProvider',
  MenuOptions: 'MenuOptions',
  MenuOption: 'MenuOption',
  MenuTrigger: 'MenuTrigger',
}));

jest.mock('@react-navigation/native', () => {
  return {
    createAppContainer: jest
      .fn()
      .mockReturnValue(function NavigationContainer() {
        return null;
      }),
    createDrawerNavigator: jest.fn(),
    createMaterialTopTabNavigator: jest.fn(),
    createStackNavigator: jest.fn(),
    StackActions: {
      push: jest
        .fn()
        .mockImplementation(x => ({ ...x, type: 'Navigation/PUSH' })),
      replace: jest
        .fn()
        .mockImplementation(x => ({ ...x, type: 'Navigation/REPLACE' })),
    },
    NavigationActions: {
      navigate: jest.fn().mockImplementation(x => x),
    },
    useNavigation: () => {
      return { navigate: jest.fn() };
    },
    useFocusEffect: jest.fn(),
  };
});
