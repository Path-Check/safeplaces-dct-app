import * as RNPermission from 'react-native-permissions/lib/typescript';
const {
  PERMISSIONS,
  RESULTS,
} = require('react-native-permissions/lib/commonjs/constants.js');

export { PERMISSIONS, RESULTS };

// mock out any functions you want in this style...
export const check = jest.fn().mockResolvedValue(RESULTS.GRANTED);

export const openSettings = jest.fn();
