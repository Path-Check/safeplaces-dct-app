import styled from '@emotion/native';
import { ThemeProvider } from 'emotion-theming';
import * as React from 'react';

import { Typography } from './Typography';

/**
 * @param {{
 *   label: string,
 *   secondary?: boolean,
 *   icon?: React.ReactNode,
 *   onPress: () => void,
 * }} param0
 */
export const Button = ({ label, secondary, icon, onPress }) => {
  return (
    <Container
      onPress={onPress}
      accessible
      accessibilityLabel={label}
      accessibilityRole='button'
      hasIcon={!!icon}
      secondary={secondary}>
      <ThemeProvider theme={invertTextColors}>
        <Typography use='button' secondary={secondary}>
          {label}
        </Typography>
        {icon ? icon : null}
      </ThemeProvider>
    </Container>
  );
};

const invertTextColors = theme => {
  return {
    ...theme,
    textPrimaryOnBackground: theme.onPrimary,
    textSecondaryOnBackground: theme.primary,
  };
};

const themePrimary = ({ theme, secondary }) =>
  secondary ? 'transparent' : theme.primary;
const getBorderColor = ({ theme, secondary }) =>
  secondary ? theme.primary : 'transparent';

const getJustifyContent = ({ hasIcon }) =>
  hasIcon ? 'space-between' : 'center';

const Container = styled.View`
  background-color: ${themePrimary};
  height: 72px;
  border: 2px solid ${getBorderColor};
  padding: 16px;
  border-radius: 8px;
  flex-direction: row;
  justify-content: ${getJustifyContent};
  align-content: center;
  align-items: center;
`;
