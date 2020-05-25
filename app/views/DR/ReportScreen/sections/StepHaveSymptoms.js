import { Container, Content, Text } from 'native-base';
import React, { useContext, useState } from 'react';
import { ScrollView, View } from 'react-native';

import BulletItem from '../../../../components/DR/BulletItem';
import styles from '../../../../components/DR/Header/style';
import context from '../../../../components/DR/Reduces/context';
import ToggleButtons from '../../../../components/DR/ToggleButtons';

const StepHaveSymptoms = ({ setCompleted, sendData }) => {
  const [
    {
      answers: { usage, haveSymptoms },
    },
    setGlobalState,
  ] = useContext(context);
  const sustantive = usage === 'others' ? 'Tiene' : 'Tengo';

  const [symptoms, setSymptoms] = useState(
    haveSymptoms == true
      ? `${sustantive} al menos uno de estos síntomas`
      : haveSymptoms == false
      ? `No ${sustantive.toLowerCase()} ninguno de estos síntomas`
      : '',
  );
  if (symptoms) {
    setCompleted(true);
    sendData(symptoms);
  }

  const setSelectedOption = selected => {
    setSymptoms(selected);
    selected =
      selected === `${sustantive} al menos uno de estos síntomas`
        ? true
        : false;
    setGlobalState({
      type: 'ADD_ANSWERS',
      value: { haveSymptoms: selected },
    });
  };
  return (
    <Container>
      <Content>
        <View>
          <ScrollView>
            <View style={styles.formContainer}>
              <Text style={styles.subtitles}>¿Es esto una emergencia?</Text>
              <Text>
                Deténgase y llame al *462 si
                {usage === 'others' && ' la persona a la que evaluarás'} tiene
                alguno de estos síntomas:
              </Text>
              <BulletItem text='Dolor en el pecho o presión.' />
              <BulletItem text='Marcada dificultad para respirar.' />
              <BulletItem text='Mareo o aturdimiento constante y severo.' />
              <BulletItem text='Dificultad para hablar.' />
              <BulletItem text='Dificultad para despertarse.' />
              <BulletItem text='Convulsiones.' />
              <BulletItem text='Vómito o diarrea persistente o con sangre.' />
              <BulletItem text='Secreciones por boca y nariz con sangre.' />
              <View>
                <ToggleButtons
                  options={[
                    `${sustantive} al menos uno de estos síntomas`,
                    `No ${sustantive.toLowerCase()} ninguno de estos síntomas`,
                  ]}
                  onSelection={selected => setSelectedOption(selected)}
                  selectedOption={symptoms}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </Content>
    </Container>
  );
};

export default StepHaveSymptoms;
