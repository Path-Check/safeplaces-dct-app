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
export const smallestLineHeight = 14;
export const smallerLineHeight = 16;
export const smallLineHeight = 20;
export const mediumLineHeight = 24;
export const largeLineHeight = 28;
export const largestLineHeight = 32;
export const hugeLineHeight = 50;

// Font Weights
export const lighterWeight = '200';
export const lightWeight = '300';
export const baseWeight = '400';
export const heavyWeight = '500';
export const heaviestWeight = '700';

// Font Families
export const baseFontFamily = 'IBMPlexSans';
export const mediumFontFamily = 'IBMPlexSans-Medium';
export const boldFontFamily = 'IBMPlexSans-Bold';
export const monospaceFontFamily = 'IBMPlexMono';

export const extraBold: TextStyle = {
  fontFamily: boldFontFamily,
  fontWeight: heaviestWeight,
};

export const bold: TextStyle = {
  fontFamily: boldFontFamily,
  fontWeight: heavyWeight,
};

export const mediumBold: TextStyle = {
  fontFamily: mediumFontFamily,
};

export const monospace: TextStyle = {
  fontFamily: monospaceFontFamily,
};

export const base: TextStyle = {
  fontFamily: baseFontFamily,
};

// Standard Font Types
export const tinyFont: TextStyle = {
  ...base,
  lineHeight: smallestLineHeight,
  fontSize: tiny,
};

export const smallFont: TextStyle = {
  ...base,
  lineHeight: smallLineHeight,
  fontSize: small,
};

export const mediumFont: TextStyle = {
  ...base,
  lineHeight: mediumLineHeight,
  fontSize: medium,
};

export const largeFont: TextStyle = {
  ...base,
  lineHeight: largestLineHeight,
  fontSize: large,
};

export const largerFont: TextStyle = {
  ...base,
  lineHeight: largestLineHeight,
  fontSize: larger,
};

export const largestFont: TextStyle = {
  ...base,
  lineHeight: largestLineHeight,
  fontSize: largest,
};

export const hugeFont: TextStyle = {
  ...base,
  lineHeight: hugeLineHeight,
  fontSize: huge,
};

// Headers
export const header1: TextStyle = {
  ...hugeFont,
  ...bold,
  color: Colors.primaryHeaderText,
};

export const header2: TextStyle = {
  ...largestFont,
  ...bold,
  color: Colors.primaryHeaderText,
};

export const header3: TextStyle = {
  ...largerFont,
  ...bold,
  color: Colors.primaryHeaderText,
};

export const header4: TextStyle = {
  ...smallFont,
  color: Colors.secondaryHeaderText,
};

export const header5: TextStyle = {
  ...mediumFont,
  ...extraBold,
  color: Colors.primaryHeaderText,
};

export const header6: TextStyle = {
  ...largerFont,
  ...bold,
  color: Colors.black,
};

export const header7: TextStyle = {
  ...largerFont,
  color: Colors.invertedText,
};

export const title: TextStyle = {
  ...largeFont,
  fontWeight: heaviestWeight,
  color: Colors.primaryText,
};

export const footer: TextStyle = {
  ...mediumFont,
  ...bold,
  color: Colors.black,
};

// Content
export const mainContent: TextStyle = {
  ...mediumFont,
  color: Colors.primaryText,
};

export const mainContentViolet: TextStyle = {
  ...mediumFont,
  color: Colors.secondaryViolet,
};

export const secondaryContent: TextStyle = {
  ...mediumFont,
  ...base,
  color: Colors.secondaryText,
  lineHeight: mediumLineHeight,
};

export const tertiaryContent: TextStyle = {
  ...smallFont,
  color: Colors.tertiaryText,
  lineHeight: smallLineHeight,
};

export const quaternaryContent: TextStyle = {
  ...smallFont,
  color: Colors.invertedText,
  lineHeight: smallLineHeight,
};

export const description: TextStyle = {
  ...smallFont,
  color: Colors.primaryText,
  lineHeight: smallerLineHeight,
};

export const disclaimer: TextStyle = {
  ...smallFont,
  ...monospace,
  color: Colors.secondaryText,
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

// Forms
export const primaryTextInput: TextStyle = {
  ...extraBold,
  fontSize: larger,
  lineHeight: largest,
  color: Colors.primaryText,
};

// Navigation
export const navHeader: TextStyle = {
  ...largeFont,
  ...bold,
  color: Colors.white,
  textTransform: 'uppercase',
};

// Tappables
export const tappableListItem: TextStyle = {
  ...mediumFont,
  color: Colors.primaryViolet,
};

// Buttons
export const buttonText: TextStyle = {
  fontSize: large,
  fontWeight: heavyWeight,
};

export const buttonTextDark: TextStyle = {
  ...buttonText,
  color: Colors.primaryViolet,
};

export const buttonTextLight: TextStyle = {
  ...buttonText,
  color: Colors.white,
};

export const buttonTextPrimary: TextStyle = {
  ...buttonText,
  color: Colors.white,
};

export const buttonTextPrimaryDisabled: TextStyle = {
  ...buttonText,
  color: Colors.white,
};

export const buttonTextPrimaryInverted: TextStyle = {
  ...buttonText,
  color: Colors.primaryViolet,
};

export const buttonTextSecondary: TextStyle = {
  ...buttonText,
  color: Colors.darkGray,
};

export const buttonTextSecondaryInverted: TextStyle = {
  ...buttonText,
  color: Colors.white,
};

export const buttonTextTinyDark: TextStyle = {
  ...buttonTextDark,
  ...tinyFont,
};

export const inputLabel: TextStyle = {
  ...bold,
  color: Colors.primaryText,
  fontSize: large,
  lineHeight: mediumLineHeight,
};
