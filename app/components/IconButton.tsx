import styled from '@emotion/native';
import React from 'react';
import { SvgXml } from 'react-native-svg';

/**
 * A theme aware icon button
 *
 * @param {{
 *   icon: SvgXml;
 *   accessibilityLabel: string;
 *   size?: number;
 * }} param0
 */

interface IconButtonProps {
  icon: string;
  accessibilityLabel?: string;
  size?: number;
  onPress?: () => void;
}

export const IconButton = ({
  icon,
  accessibilityLabel,
  size,
  ...otherProps
}: IconButtonProps): JSX.Element => {
  return (
    <Container accessibilityLabel={accessibilityLabel} {...otherProps}>
      <SvgXml xml={icon} width={size || 24} height={size || 24} />
    </Container>
  );
};

const Container = styled.TouchableOpacity`
  align-items: center;
  align-content: center;
`;
