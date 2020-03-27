import mockAsyncStorage from '@react-native-community/async-storage/jest/async-storage-mock';

jest.mock('@react-native-community/async-storage', () => mockAsyncStorage);
jest.mock('@react-native-community/push-notification-ios', () => 'push-notification-ios');
jest.mock('react-native-share', () => 'Share');
jest.mock('rn-fetch-blob', () => 'Blob');
jest.mock('react-native-map-clustering', () => 'MapView');
jest.mock('react-native-background-timer', () => 'BackgroundTimer');
jest.mock('react-native-popup-menu', () => ({
  Menu: 'Menu',
  MenuProvider: 'MenuProvider',
  MenuOptions: 'MenuOptions',
  MenuOption: 'MenuOption',
  MenuTrigger: 'MenuTrigger',
}));
