import styled from '@emotion/native';
import React from 'react';
import { SvgXml } from 'react-native-svg';

import { themeTextColor } from '../constants/themes';

/**
 * A theme aware icon button
 *
 * @param {{
 *   icon: SvgXml;
 *   accessibilityLabel: string;
 *   secondary?: boolean;
 *   size?: number;
 * }} param0
 */
export const IconButton = ({
  icon,
  accessibilityLabel,
  secondary,
  size,
  ...otherProps
}) => {
  return (
    <Container accessibilityLabel={accessibilityLabel} {...otherProps}>
      <Icon
        xml={icon}
        secondary={secondary}
        width={size || 24}
        height={size || 24}
      />
    </Container>
  );
};

const Container = styled.TouchableOpacity`
  align-items: center;
  align-content: center;
`;

const Icon = styled(SvgXml)`
  color: ${themeTextColor};
`;
