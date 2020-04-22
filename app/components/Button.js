import styled from '@emotion/native';
import * as React from 'react';

import { Typography } from './Typography';

/**
 * @param {{
 *   label: string,
 *   icon: React.ReactNode,
 *   onPress: () => void,
 * }} param0
 */
export const Button = ({ title, icon, onPress }) => {
  return (
    <Container
      onPress={onPress}
      accessible
      accessibilityLabel={title}
      accessibilityRole='button'
      hasIcon={!!icon}>
      <Typography use='button'>{title}</Typography>
      {icon}
    </Container>
  );
};

const themePrimary = ({ theme }) => theme.primary;
const themeOnPrimary = ({ theme }) => theme.onPrimary;
const getBorderColor = ({ theme, secondary }) =>
  secondary ? theme.primary : 'transparent';

const getJustifyContent = ({ hasIcon }) =>
  hasIcon ? 'space-between' : 'center';

const Container = styled.TouchableOpacity`
  background-color: ${themePrimary};
  color: ${themeOnPrimary};
  height: 72px;
  border: 1px solid ${getBorderColor};
  padding: 16px;
  border-radius: 8px;
  flex-direction: row;
  justify-content: ${getJustifyContent};
`;
