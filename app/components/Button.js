import styled from '@emotion/native';
import { ThemeProvider } from 'emotion-theming';
import * as React from 'react';
import { SvgXml } from 'react-native-svg';

import { Typography } from './Typography';

/**
 * @param {{
 *   label: string;
 *   secondary?: boolean;
 *   icon?: string;
 *   onPress: () => void;
 *   disabled?: boolean;
 * }} param0
 */
export const Button = ({
  label,
  secondary,
  icon,
  onPress,
  disabled,
  small,
  ...otherProps
}) => {
  return (
    <Container
      onPress={onPress}
      accessible
      accessibilityLabel={label}
      accessibilityRole='button'
      hasIcon={!!icon}
      secondary={secondary}
      disabled={disabled}
      small={small}
      {...otherProps}>
      <ThemeProvider theme={invertTextColors}>
        <Label small={small} secondary={secondary} disabled={disabled}>
          {label}
        </Label>
        {icon ? <Icon xml={icon} /> : null}
      </ThemeProvider>
    </Container>
  );
};

const invertTextColors = (theme) => {
  return {
    ...theme,
    textPrimaryOnBackground: theme.onPrimary,
    textSecondaryOnBackground: theme.primary,
  };
};

const themePrimary = ({ theme, secondary, disabled }) =>
  disabled ? theme.disabled : secondary ? 'transparent' : theme.primary;

const getBorderColor = ({ theme, secondary }) =>
  secondary ? theme.primary : 'transparent';

const getJustifyContent = ({ hasIcon }) =>
  hasIcon ? 'space-between' : 'center';

const Container = styled.TouchableOpacity`
  background-color: ${themePrimary};
  height: ${({ small }) => (small ? '48px' : '72px')};
  border: 2px solid ${getBorderColor};
  padding-horizontal: ${({ small }) => (small ? '14px' : '16px')};
  border-radius: 8px;
  flex-direction: row;
  justify-content: ${getJustifyContent};
  align-content: center;
  align-items: center;
  align-self: stretch;
`;

const getFontSize = ({ small }) => (small ? '14px' : '20px');

const getLineHeight = ({ small }) => (small ? '21px' : '40px');

const Label = styled(Typography)`
  font-family: IBMPlexSans-Medium;
  font-size: ${getFontSize};
  line-height: ${getLineHeight};
  font-weight: normal;
`;

const Icon = styled(SvgXml)`
  margin-right: 8px; // for visual alignment
`;
