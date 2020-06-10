import { ViewStyle } from 'react-native';

import * as Colors from './colors';
import * as Spacing from './spacing';

// Global Header Styles
export const headerStyle: ViewStyle = {
  backgroundColor: Colors.invertedSecondaryBackground,
  borderBottomWidth: 0,
  height: 40,
};

export const screenHeaderStyle: ViewStyle = {
  paddingTop: Spacing.xxxSmall,
  paddingBottom: Spacing.xxSmall,
  backgroundColor: Colors.invertedSecondaryBackground,
  paddingLeft: Spacing.small,
  flexDirection: 'row',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
};
