import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import ToggleButtons from '../../../components/ToggleButtons';

import styles from '../../../components/styles';
import Colors from '../../../constants/Colors';

export default function StepSex() {
  const [selectedOption, setSelectedOption] = useState(null);

  return (
    <View>
      <Text style={styles.subtitles}>Sexo</Text>
      <ToggleButtons
        options={['Masculino', 'Femenino']}
        onSelection={setSelectedOption}
        selectedOption={selectedOption}
      />
    </View>
  );
}
