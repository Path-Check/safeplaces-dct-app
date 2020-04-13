import * as React from 'react';
import styled from '@emotion/native';

export const Type = {
  Headline1: 'headline1',
  Headline2: 'headline2',
  Body1: 'body1',
  Body2: 'body2',
  Body3: 'body3',
};

/**
 * A correctly sized, spaced and colored text element.
 *
 * Use within a `<ThemeProvider>`
 *
 * @param {{
 *   use?: string,
 *   secondary?: boolean,
 *   monospace?: boolean,
 * }} param0
 */
export const Typography = ({
  use = Type.Body1,
  secondary,
  monospace,
  children,
  ...otherProps
}) => {
  return (
    <ThemedText
      use={use}
      secondary={secondary}
      monospace={monospace}
      {...otherProps}>
      {children}
    </ThemedText>
  );
};

const FONT_SIZE_MAP = {
  [Type.Headline1]: '52px',
  [Type.Headline2]: '26px',
  [Type.Body1]: '18px',
  [Type.Body2]: '16px',
  [Type.Body3]: '15px',
};

const getFontSize = ({ use = Type.Body1 }) => FONT_SIZE_MAP[use];

const LINE_HEIGHT_MAP = {
  [Type.Headline1]: '48px',
  [Type.Headline2]: '34px',
  [Type.Body1]: '24px',
  [Type.Body2]: '22px',
  [Type.Body3]: '24px',
};

const getLineHeight = ({ use = Type.Body1 }) => LINE_HEIGHT_MAP[use];

const getTextColor = ({ theme, secondary = false }) =>
  secondary ? theme.textSecondaryOnBackground : theme.textPrimaryOnBackground;

const getFontWeight = ({ use = Type.Body1 }) =>
  use.startsWith('headline') ? 'bold' : 'normal';

const ThemedText = styled.Text`
  font-family: ${({ monospace }) =>
    monospace ? 'IBM Plex Mono' : 'IBM Plex Sans'};
  font-size: ${getFontSize};
  font-weight: ${getFontWeight};
  line-height: ${getLineHeight};
  color: ${getTextColor};
`;
