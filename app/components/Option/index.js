import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import Icon from '../../assets/svgs/check';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import { Colors as AssessmentColors } from '../../views/assessment/constants';
import { Typography } from '../Typography';
import { OptionSelect } from './OptionSelect';

const INDICATOR_WIDTH = 20;
const INDICATOR_MARGIN = 10;

export function Option({
  isValidType,
  isSelected,
  inputType,
  title,
  description,
  onPress,
}) {
  return (
    <TouchableOpacity onPress={onPress} testID='option'>
      <View style={[styles.container, isSelected && styles.containerSelected]}>
        <OptionSelect
          wrapperStyle={styles.primary}
          isValidType={isValidType}
          isSelected={isSelected}
          title={title}
          inputType={inputType}
          icon={Icon}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.WHITE,
    borderColor: AssessmentColors.BORDER,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  containerSelected: {
    backgroundColor: Colors.SECONDARY_50,
    borderColor: Colors.PRIMARY_50,
  },
  primary: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
