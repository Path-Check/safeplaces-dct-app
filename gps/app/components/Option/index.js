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
        <View style={styles.content}>
          {description && (
            <Typography style={styles.description}>{description}</Typography>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.WHITE,
    borderColor: AssessmentColors.BORDER,
    borderRadius: 8,
    borderWidth: 2,
    marginBottom: 16,
    padding: 10,
  },
  containerSelected: {
    borderColor: AssessmentColors.BORDER_SELECTED,
    elevation: 1,
    shadowColor: Colors.BLACK,
    shadowOffset: { height: 0, width: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  indicator: {
    alignItems: 'center',
    borderColor: AssessmentColors.BORDER,
    borderRadius: INDICATOR_WIDTH * 2,
    borderWidth: 2,
    height: INDICATOR_WIDTH,
    justifyContent: 'center',
    marginRight: INDICATOR_MARGIN,
    width: INDICATOR_WIDTH,
  },
  indicatorSelected: {
    backgroundColor: AssessmentColors.BORDER_SELECTED,
    borderColor: AssessmentColors.BORDER_SELECTED,
  },
  indicatorIcon: {},
  indicatorIconRadio: {
    borderRadius: 100,
    backgroundColor: Colors.WHITE,
    height: INDICATOR_WIDTH * 0.5,
    width: INDICATOR_WIDTH * 0.5,
  },
  title: {
    flex: 1,
    flexWrap: 'wrap',
    color: Colors.BLACK,
    fontSize: 20,
  },
  description: {
    fontFamily: Fonts.primaryRegular,
    fontSize: 16,
    color: Colors.BLACK,
    marginLeft: INDICATOR_WIDTH + INDICATOR_MARGIN,
  },
  primary: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
