import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import Icon from '../../assets/svgs/check';
import Colors from '../../constants/colors';
import { Colors as AssessmentColors } from '../../views/assessment/constants';
import { OptionSelect } from './OptionSelect';

export function Option({
  isValidType,
  isSelected,
  inputType,
  title,
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
