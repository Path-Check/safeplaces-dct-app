import React from 'react';
import { View, Text } from 'react-native';
import { RadioButtons } from 'react-native-radio-buttons';
import { Button } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';

import styles from './styles';
import Colors from '../constants/Colors';

// eslint-disable-next-line
export default function ToggleButtons({
  options,
  selectedOption,
  onSelection,
}) {
  function renderOption(option, selected, onSelect, index) {
    const buttonStyle = {
      backgroundColor: selected ? '#D8EAFE' : Colors.lightBlue,
      borderColor: selected ? Colors.mainBlue : Colors.lightBlue,
      borderWidth: 2,
    };
    const textStyle = {
      color: selected ? Colors.mainBlue : Colors.buttonLightText,
    };

    return (
      <Button
        transparent
        onPress={onSelect}
        key={index}
        style={[styles.rectButtons, buttonStyle]}
      >
        {selected ? (
          <Icon
            name="check-circle"
            color={Colors.mainBlue}
            size={15}
            style={{
              backgroundColor: '#fff',
              position: 'absolute',
              right: -7,
              top: -7,
            }}
          />
        ) : null}
        <Text style={textStyle}>{option}</Text>
      </Button>
    );
  }

  const renderContainer = (optionNodes) => (
    <View style={[styles.radioButtonLayout, { flexWrap: 'wrap' }]}>
      {optionNodes}
    </View>
  );

  return (
    <RadioButtons
      options={options}
      onSelection={onSelection}
      selectedOption={selectedOption}
      renderOption={renderOption}
      renderContainer={renderContainer}
    />
  );
}
