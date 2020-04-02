import mockAsyncStorage from '@react-native-community/async-storage/jest/async-storage-mock';

jest.mock('@react-native-community/async-storage', () => mockAsyncStorage);
jest.mock(
  '@react-native-community/push-notification-ios',
  () => 'push-notification-ios',
);
jest.mock('react-native-share', () => 'Share');
jest.mock('rn-fetch-blob', () => 'Blob');
jest.mock('react-native-maps', () => 'MapView');
jest.mock('react-native-background-timer', () => 'BackgroundTimer');
jest.mock('react-native-permissions', () => 'Permissions');
jest.mock('react-native-popup-menu', () => ({
  Menu: 'Menu',
  MenuProvider: 'MenuProvider',
  MenuOptions: 'MenuOptions',
  MenuOption: 'MenuOption',
  MenuTrigger: 'MenuTrigger',
}));

jest.mock('react-native-permissions', () => 'Permissions');
jest.mock('@react-navigation/native', () => {
  return {
    createAppContainer: jest
      .fn()
      .mockReturnValue(function NavigationContainer(props) {
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
