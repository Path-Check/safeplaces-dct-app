import React from 'react';
import styled from '@emotion/native';
import { ThemeProvider } from 'emotion-theming';

import Color from './colors';

/** Main theme, violet on pale violet bg. e.g. Settings */
export const main = {
  background: Color.VIOLET_ALPHA_06,
  textPrimaryOnBackground: Color.VIOLET,
  textSecondaryOnBackground: 'rgba(64, 81, 219, 0.6)',

  primary: Color.VIOLET_BUTTON,
  onPrimary: Color.WHITE,

  success: Color.SUCCESS,
  warning: Color.WARNING,
  borders: Color.GRAY_BACKGROUND,
};

/** Inverted theme, white on violet bg. E.g. Main screen */
export const inverted = {
  ...main,
  background: `linear-gradient(245.21deg, ${Color.VIOLET_BUTTON} 0%, ${Color.VIOLET_BUTTON_DARK} 100%);`,
  textPrimaryOnBackground: Color.WHITE,
  textSecondaryOnBackground: 'rgba(255, 255, 255, 0.6)',

  primary: Color.WHITE,
  onPrimary: Color.VIOLET,
};

/** Mono, black on white. e.g. Exposure history screen */
export const mono = {
  ...main,
  background: Color.WHITE,
  textPrimaryOnBackground: Color.MONO_DARK,
  textSecondaryOnBackground: Color.MONO_SECONDARY,

  primary: Color.VIOLET_BUTTON,
  onPrimary: Color.WHITE,
};

/** Dark, white on gray. E.g. Possible exposure mode on main screen */
export const dark = {
  ...main,
  background: Color.DARK_GRAY,
  textPrimaryOnBackground: Color.WHITE,
  textSecondaryOnBackground: Color.LIGHT_GRAY,

  primary: Color.WHITE,
  onPrimary: Color.DARK_GRAY,
};

const THEME_MAP = {
  main,
  inverted,
  mono,
  dark,
};

export const ThemedBackground = styled.View`
  background-color: ${({ theme }) => theme.background};
`;

/** Return theme config for a known theme name */
export const getTheme = t => {
  const themeColors = THEME_MAP[t];
  if (!themeColors) {
    throw new Error(`Unknown theme ${t}`);
  }
  return themeColors;
};

/**
 * Configure themeable components with primary, bg and secondary colors
 *
 * @param {{
 *   use?: string,
 *   setBackground?: boolean,
 * }} param0
 */
export const Theme = ({ use = 'main', setBackground = false, children }) => {
  return (
    <ThemeProvider theme={getTheme(use)}>
      {setBackground ? (
        <ThemedBackground>{children}</ThemedBackground>
      ) : (
        children
      )}
    </ThemeProvider>
  );
};
