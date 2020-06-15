import { TextStyle } from 'react-native';

import * as Colors from './colors';

// Font Sizes
export const tiny = 11;
export const smallest = 12;
export const smaller = 13;
export const small = 15;
export const medium = 17;
export const large = 19;
export const larger = 22;
export const largest = 28;
export const huge = 52;

// Line Heights
export const smallestLineHeight = 16;
export const smallerLineHeight = 20;
export const smallLineHeight = 24;
export const mediumLineHeight = 28;
export const largeLineHeight = 32;
export const largestLineHeight = 40;
export const hugeLineHeight = 52;

// Font Weights
export const lighterWeight = '200';
export const lightWeight = '300';
export const baseWeight = '400';
export const heavyWeight = '500';
export const heaviestWeight = '700';

// Standard Font Types
export const smallFont: TextStyle = {
  lineHeight: smallLineHeight,
  fontSize: small,
};

export const mediumFont: TextStyle = {
  lineHeight: mediumLineHeight,
  fontSize: medium,
};

export const largeFont: TextStyle = {
  lineHeight: largestLineHeight,
  fontSize: large,
};

export const largestFont: TextStyle = {
  lineHeight: largestLineHeight,
  fontSize: largest,
};

// Headers
export const header1: TextStyle = {
  ...largestFont,
  fontWeight: heaviestWeight,
  color: Colors.primaryText,
};

export const header2: TextStyle = {
  ...largeFont,
  fontWeight: heavyWeight,
};

export const title: TextStyle = {
  ...largeFont,
  fontWeight: heaviestWeight,
  color: Colors.primaryText,
};

// Content
export const mainContent: TextStyle = {
  ...mediumFont,
  color: Colors.primaryText,
};

export const secondaryContent: TextStyle = {
  ...mediumFont,
  color: Colors.secondaryText,
  lineHeight: mediumLineHeight,
};

export const description: TextStyle = {
  ...smallFont,
  color: Colors.primaryText,
};

export const label: TextStyle = {
  ...smallFont,
  color: Colors.primaryText,
};

export const error: TextStyle = {
  color: Colors.defaultRed,
  fontSize: smaller,
  fontWeight: heavyWeight,
};

// Tappables
export const tappableListItem: TextStyle = {
  fontSize: larger,
};

// Buttons
export const buttonText: TextStyle = {
  fontSize: medium,
  fontWeight: heavyWeight,
};

export const darkButtonText: TextStyle = {
  ...buttonText,
  color: Colors.white,
};

export const baseWeightButtonText: TextStyle = {
  ...buttonText,
  fontWeight: baseWeight,
};

export const borderlessButtonText: TextStyle = {
  color: Colors.defaultBlue,
  fontSize: medium,
  fontWeight: heaviestWeight,
};

export const ctaButtonOutlined: TextStyle = {
  ...largeFont,
  fontWeight: heavyWeight,
  color: Colors.primaryBlue,
};

export const ctaButtonFilled: TextStyle = {
  ...largeFont,
  fontWeight: heavyWeight,
  color: Colors.white,
};
