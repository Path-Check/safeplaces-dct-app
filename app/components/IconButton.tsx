import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { SvgXml } from 'react-native-svg';

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
}: IconButtonProps): JSX.Element => {
  return (
    <TouchableOpacity
      accessibilityLabel={accessibilityLabel}
      style={styles.icon}>
      <SvgXml xml={icon} width={size || 24} height={size || 24} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
