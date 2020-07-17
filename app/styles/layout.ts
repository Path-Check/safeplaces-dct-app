import { Dimensions } from 'react-native';

import * as Spacing from './spacing';

export const screenWidth = Dimensions.get('window').width;
export const screenHeight = Dimensions.get('window').height;

export const baseScreenPadding = Spacing.xSmall;

export const xxSmallWidth = 0.05 * screenWidth;
export const mediumWidth = 0.4 * screenWidth;
export const halfWidth = 0.5 * screenWidth;
export const largeWidth = 0.6 * screenWidth;

export const xxSmallHeight = 0.03 * screenHeight;
export const smallHeight = 0.05 * screenHeight;
export const oneTenthHeight = 0.1 * screenHeight;
export const mediumHeight = 0.45 * screenHeight;
export const halfHeight = 0.5 * screenHeight;

export const tappableHeight = 0.1 * screenHeight;

export const baseHorizontalMargin = Spacing.xSmall;
export const horizontalMarginSmall = Spacing.xxxSmall;
export const horizontalMarginMedium = Spacing.medium;

export const baseFullWidthWithMargin = screenWidth - baseHorizontalMargin * 2;
export const fullWidthWithSmallMargin = screenWidth - horizontalMarginSmall * 2;
export const fullWidthWithMediumMargin =
  screenWidth - horizontalMarginMedium * 2;

export const navBar = tappableHeight + Spacing.xSmall;

// zIndex
export const level1 = 1;
export const level2 = 2;
export const level3 = 3;
