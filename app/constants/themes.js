import styled from '@emotion/native';
import { ThemeProvider } from 'emotion-theming';
import React from 'react';

import Color from './colors';

/** Violet on pale violet bg. e.g. Settings */
export const defaultTheme = {
  background: Color.VIOLET_ALPHA_06,
  textPrimaryOnBackground: Color.VIOLET,
  textSecondaryOnBackground: 'rgba(64, 81, 219, 0.6)',

  navBar: Color.VIOLET,
  onNavBar: Color.WHITE,

  /** E.g. button bg */
  primary: Color.VIOLET_BUTTON,
  /** E.g. button text color */
  onPrimary: Color.WHITE,

  success: Color.SUCCESS,
  warning: Color.WARNING,
  disabled: 'rgba(64, 81, 219, 0.6)',
  border: Color.DIVIDER,
};

/** White on violet bg. E.g. Main screen */
export const violet = {
  ...defaultTheme,
  background: `linear-gradient(245.21deg, ${Color.VIOLET_BUTTON} 0%, ${Color.VIOLET_BUTTON_DARK} 100%);`,
  textPrimaryOnBackground: Color.WHITE,
  textSecondaryOnBackground: 'rgba(255, 255, 255, 0.6)',

  navBarBorder: Color.VIOLET, // no visible border

  primary: Color.WHITE,
  onPrimary: Color.VIOLET,
};

/** White on gray bg. E.g. Possible exposure mode on default screen */
export const charcoal = {
  ...defaultTheme,
  background: Color.DARK_GRAY,
  textPrimaryOnBackground: Color.WHITE,
  textSecondaryOnBackground: Color.LIGHT_GRAY,

  navBar: Color.DARK_GRAY,
  navBarBorder: Color.DARK_GRAY, // no visible border

  primary: Color.WHITE,
  onPrimary: Color.DARK_GRAY,

  disabled: '#A9AFBA',
};

const THEME_MAP = {
  default: defaultTheme,
  violet,
  charcoal,
};

/** A view which uses the theme's background color */
export const ThemedBackground = styled.View`
  background-color: ${({ theme }) => theme.background};
`;

/**
 * Return theme config for a known theme name
 *
 * @param {'default' | 'violet' | 'charcoal'} themeName
 */
export const getTheme = themeName => {
  const themeColors = THEME_MAP[themeName];
  if (!themeColors) {
    throw new Error(`Unknown theme ${themeName}`);
  }
  return themeColors;
};

/**
 * Configures themeable sub-components with background, text (primary,
 * secondary), button and other various theme colors.
 *
 * Usage:
 *
 * This will render a charcoal view, with a white heading, and a grey paragraph.
 *
 * ```jsx
 * <Theme use="charcoal" setBackground>
 *   <Typography use="headline2">Test</Typogrphy>
 *   <Typography secondary>Paragraph here</Typogrphy>
 * </Theme>
 * ```
 *
 * It makes available the following `props.theme.x` properties in styled components:
 *
 * - background - the standard bg color
 * - primary - the primary theme/button color on top of bakground (e.g. violet)
 * - onPrimary - color to show on top of primary (usually white)
 * - onPrimary - color to show on top of primary (usually white)
 * - textPrimaryOnBackground - text color to show on background
 * - textSecondaryOnBackground - secondary text color to show on background
 * - warning - warning color (always orange)
 * - success - success color (always green)
 * - border - border/divider color (usually gray)
 *
 * @param {{
 *   use?: string,
 *   setBackground?: boolean,
 * }} param0
 */
export const Theme = ({ use = 'default', setBackground = false, children }) => {
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
