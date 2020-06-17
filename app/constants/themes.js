import styled from '@emotion/native';
import { ThemeProvider } from 'emotion-theming';
import React from 'react';

import { Colors } from '../styles';

/** Violet on pale violet bg. e.g. Settings */
export const defaultTheme = {
  background: Colors.faintGray,
  textPrimaryOnBackground: Colors.violetText,
  textSecondaryOnBackground: Colors.black,

  navBar: Colors.primaryViolet,
  onNavBar: Colors.white,

  /** E.g. button bg */
  primary: Colors.primaryViolet,
  /** E.g. button text color */
  onPrimary: Colors.white,

  success: Colors.success,
  warning: Colors.warning,
  disabled: 'rgba(64, 81, 219, 0.6)',
  disabledLight: Colors.secondaryViolet,
  border: Colors.tertiaryViolet,
};

/** White on violet bg. E.g. Main screen */
export const violet = {
  ...defaultTheme,
  background: `linear-gradient(245.21deg, ${Colors.primaryViolet} 0%, ${Colors.violetButtonDark} 100%);`,
  textPrimaryOnBackground: Colors.white,
  textSecondaryOnBackground: 'rgba(255, 255, 255, 0.6)',

  navBarBorder: Colors.primaryViolet, // no visible border

  primary: Colors.white,
  onPrimary: Colors.primaryViolet,
  disabled: '#ececec',
  disabledLight: '#ececec',
};

export const charcoal = {
  ...defaultTheme,
  background: Colors.darkGray,
  textPrimaryOnBackground: Colors.white,
  textSecondaryOnBackground: Colors.lightGray,

  navBar: Colors.darkGray,
  navBarBorder: Colors.darkGray, // no visible border

  primary: Colors.white,
  onPrimary: Colors.darkGray,

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
export const getTheme = (themeName) => {
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

/**
 * @param {{theme: defaultTheme, secondary?: boolean}} param0
 */
export const themeTextColor = ({ theme, secondary }) =>
  secondary ? theme.textSecondaryOnBackground : theme.textPrimaryOnBackground;
