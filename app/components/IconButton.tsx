import React from 'react';
import { SvgXml } from 'react-native-svg';
import { Colors } from '../styles';
import { TouchableOpacity } from 'react-native';

interface IconButtonProps {
  icon: string;
  accessibilityLabel?: string;
  size?: number;
  onPress?: () => void;
  color?: string;
}

export const IconButton = ({
  icon,
  accessibilityLabel,
  size,
  color,
  ...otherProps
}: IconButtonProps): JSX.Element => {
  return (
    <TouchableOpacity
      style={{
        alignItems: 'center',
        alignContent: 'center',
      }}
      accessibilityLabel={accessibilityLabel}
      {...otherProps}>
      <SvgXml
        color={color || Colors.icon}
        xml={icon}
        width={size || 24}
        height={size || 24}
      />
    </TouchableOpacity>
  );
};
