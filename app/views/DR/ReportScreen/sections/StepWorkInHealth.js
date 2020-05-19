import { Container, Content, Text } from 'native-base';
import React, { useContext } from 'react';
import { ScrollView, View } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

import Checkbox from '../../../../components/DR/Checkbox';
import styles from '../../../../components/DR/Header/style';
import context from '../../../../components/DR/Reduces/context';

const StepWorkInHealth = ({ setCompleted }) => {
  const [
    {
      answers: {
        usage,
        workInHealth,
        workedInHealth,
        planWorkInHealth,
        doesntWorkInHealth,
      },
    },
    setGlobalState,
  ] = useContext(context);

  const setSelectedOption = (option, selected) => {
    setGlobalState({
      type: 'ADD_ANSWERS',
      value: { [option]: selected, doesntWorkInHealth: false },
    });
  };
  if (
    workInHealth ||
    workedInHealth ||
    planWorkInHealth ||
    doesntWorkInHealth
  ) {
    setCompleted(true);
  } else {
    setCompleted(false);
  }
  const works = usage === 'others' ? 'Trabaja' : 'Trabajo';
  return (
    <Container>
      <Content>
        <View>
          <ScrollView>
            <View style={styles.formContainer}>
              <Text style={[styles.subtitles, { marginVertical: hp('3%') }]}>
                ¿Vive o trabaja en una institución de salud? *
              </Text>
              <Text style={styles.text}>
                Incluye hospitales, salas de emergencias, cualquier ambiente
                relacionado con la medicina o centros de cuidados de largo
                plazo.
              </Text>
              <Checkbox
                text={`${works} en un centro de cuidado a largo plazo. Incluye asilo de ancianos o centros de asistencia.`}
                id='workInHealth'
                setValue={(id, value) => setSelectedOption(id, value)}
                initialCheck={workInHealth}
              />
              <Checkbox
                text={`${
                  usage === 'others' ? 'Ha' : 'He'
                } trabajado en un hospital o en un centro de asistencia en los últimos 14 días.`}
                id='workedInHealth'
                setValue={(id, value) => setSelectedOption(id, value)}
                initialCheck={workedInHealth}
              />
              <Checkbox
                text={`${
                  usage === 'others' ? 'Planea' : 'Planeo'
                } trabajar en un hospital o en cualquier otra institución de salud.`}
                id='planWorkInHealth'
                setValue={(id, value) => setSelectedOption(id, value)}
                initialCheck={planWorkInHealth}
              />
              <Checkbox
                text={`No ${
                  usage === 'others' ? 'vive' : 'vivo'
                } ni ${works.toLowerCase()} en una institución de salud.`}
                id='doesntWorkInHealth'
                setValue={(id, value) =>
                  setGlobalState({
                    type: 'ADD_ANSWERS',
                    value: {
                      workInHealth: false,
                      workedInHealth: false,
                      planWorkInHealth: false,
                      [id]: value,
                    },
                  })
                }
                initialCheck={doesntWorkInHealth}
              />
            </View>
          </ScrollView>
        </View>
      </Content>
    </Container>
  );
};

export default StepWorkInHealth;
