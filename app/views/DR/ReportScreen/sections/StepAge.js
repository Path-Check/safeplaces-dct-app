import React, { useContext, useState, useReducer } from 'react';
import { ScrollView, View } from 'react-native';
import { Container, Content, Text } from 'native-base';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import styles from '../../../components/styles';
import ToggleButtons from '../../../components/ToggleButtons';
import context from '../../../components/reduces/context';

const StepAge = ({ setCompleted }) => {
  const [
    {
      answers: { sex }
    },
    setGlobalState
  ] = useContext(context);
  const setSelectedOption = (selected, selection) => {
    setGlobalState({
      type: 'ADD_ANSWERS',
      value: { [selected]: selection }
    });
  };

  if (sex) {
    setCompleted(true);
  }
  return (
    <Container>
      <Content>
        <ScrollView>
          <View style={styles.formContainer}>
            <Text style={[styles.subtitles, { marginVertical: hp('3%') }]}>
              Sexo *
            </Text>
            <ToggleButtons
              options={['Femenino', 'Masculino']}
              onSelection={selected => setSelectedOption('sex', selected)}
              selectedOption={sex}
            />
          </View>
        </ScrollView>
      </Content>
    </Container>
  );
};

export default StepAge;
