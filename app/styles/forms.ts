import { ViewStyle, TextStyle, ImageStyle } from 'react-native';

import * as Colors from './colors';
import * as Spacing from './spacing';
import * as Outlines from './outlines';
import * as Typography from './typography';

// Global Form Styles
export const textInputFormField: TextStyle = {
  flex: 1,
  color: Colors.primaryText,
  backgroundColor: Colors.formInputBackground,
  borderRadius: Outlines.baseBorderRadius,
  borderColor: Colors.formInputBorder,
  borderWidth: 2,
  justifyContent: 'center',
  fontSize: Typography.medium,
  // Just using padding breaks vertical padding on multiline text inputs
  // See issue here: https://github.com/facebook/react-native/issues/21720
  paddingTop: Spacing.medium,
  paddingRight: Spacing.medium,
  paddingBottom: Spacing.medium,
  paddingLeft: Spacing.medium,
};

export const required: TextStyle = {
  fontSize: 12,
  color: Colors.primaryText,
  marginTop: 6,
};

export const checkbox: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
};

export const checkboxIcon: ImageStyle = {
  width: 25,
  height: 25,
  marginRight: Spacing.medium,
};

export const checkboxText: TextStyle = {
  ...Typography.mediumFont,
  color: Colors.invertedText,
};

export const inputIndicator: ViewStyle = {
  alignItems: 'center',
  borderColor: Colors.radioBorder,
  borderWidth: 2,
  height: Spacing.large,
  justifyContent: 'center',
  marginTop: Spacing.tiny,
  marginRight: Spacing.large,
  width: Spacing.large,
};
