import styled from '@emotion/native';
import { css } from '@emotion/native/dist/native.cjs.prod';
import * as React from 'react';

import { useLanguageDirection } from '../locales/languages';

export const Type = {
  Headline1: 'headline1',
  Headline2: 'headline2',
  Headline3: 'headline3',
  Body1: 'body1',
  Body2: 'body2',
  Body3: 'body3',
};

/**
 * Render a theme and visual style aware text element.
 *
 * It uses the theme's `text(Primary|Secondary)OnBackground` color and a set of
 * predefined font size and line height values.
 *
 * Inspired by: https://material-components.github.io/material-components-web-catalog/#/component/typography
 *
 * Usage:
 *
 * ```jsx
 * <Theme use="charcoal">
 *   <Typography use="headline2">Heading</Typography>
 *   <Typography use="body1" secondary>Paragraph text ...</Typography>
 *   <Typography use="body2" monospace>link</Typography>
 * </Theme>
 * ```
 *
 * Use within a `<ThemeProvider>`
 *
 * @param {{
 *   use?: string,
 *   secondary?: boolean,
 *   monospace?: boolean,
 *   bold?: boolean,
 * }} param0
 */
export const Typography = ({
  use = Type.Body1,
  secondary,
  monospace,
  bold,
  style,
  children,
  ...otherProps
}) => {
  return (
    <ThemedText
      style={[
        style,
        css`
          writing-direction: ${useLanguageDirection()};
        `,
      ]}
      use={use}
      secondary={secondary}
      monospace={monospace}
      bold={bold}
      {...otherProps}>
      {children}
    </ThemedText>
  );
};

const FONT_SIZE_MAP = {
  [Type.Headline1]: '52px',
  [Type.Headline2]: '26px',
  [Type.Headline3]: '16px',
  [Type.Body1]: '18px',
  [Type.Body2]: '16px',
  [Type.Body3]: '15px',
};

const getFontSize = ({ use = Type.Body1 }) => FONT_SIZE_MAP[use];

const LINE_HEIGHT_MAP = {
  [Type.Headline1]: '48px',
  [Type.Headline2]: '34px',
  [Type.Headline3]: '40px',
  [Type.Body1]: '24px',
  [Type.Body2]: '22px',
  [Type.Body3]: '24px',
};

const getLineHeight = ({ use = Type.Body1 }) => LINE_HEIGHT_MAP[use];

const getTextColor = ({ theme, secondary = false }) =>
  secondary ? theme.textSecondaryOnBackground : theme.textPrimaryOnBackground;

const getFontWeight = ({ use = Type.Body1, bold }) =>
  use.startsWith('headline') || bold ? 'bold' : 'normal';

const getFontFamily = ({ use, monospace, bold }) =>
  use.startsWith('headline') || bold
    ? 'IBMPlexSans-Bold'
    : monospace
    ? 'IBMPlexMono'
    : 'IBMPlexSans';

const ThemedText = styled.Text`
  color: ${getTextColor};
  font-family: ${getFontFamily};
  font-size: ${getFontSize};
  font-weight: ${getFontWeight};
  line-height: ${getLineHeight};
`;
