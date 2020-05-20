import { Container, Content, Text } from 'native-base';
import React, { useContext } from 'react';
import { ScrollView, View } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

import Checkbox from '../../../../components/DR/Checkbox';
import styles from '../../../../components/DR/Header/style';
import context from '../../../../components/DR/Reduces/context';

const StepMedicalConditions = ({ setCompleted }) => {
  const [
    {
      answers: {
        asthma,
        cancer,
        HIV,
        heartCondition,
        diabetes,
        renalInsufficiency,
        hepaticCirrhosis,
        hardCough,
        obesity,
        pregnancy,
        hypertension,
        immuneDeficiency,
        malnutrition,
        sickleCellAnemia,
        tuberculosis,
        none,
      },
    },
    setGlobalState,
  ] = useContext(context);

  const setSelectedOption = (option, selected) => {
    setGlobalState({
      type: 'ADD_ANSWERS',
      value: { [option]: selected, none: false },
    });
  };

  if (
    asthma ||
    cancer ||
    HIV ||
    heartCondition ||
    diabetes ||
    renalInsufficiency ||
    hepaticCirrhosis ||
    hardCough ||
    obesity ||
    pregnancy ||
    hypertension ||
    immuneDeficiency ||
    malnutrition ||
    sickleCellAnemia ||
    tuberculosis ||
    none
  ) {
    setCompleted(true);
  } else {
    setCompleted(false);
  }
  return (
    <Container>
      <Content>
        <View>
          <ScrollView>
            <View style={styles.formContainer}>
              <Text style={[styles.subtitles, { marginVertical: hp('3%') }]}>
                ¿Presenta alguna de estas condiciones médicas? *
              </Text>
              <Checkbox
                text='Hipertensión o presión alta.'
                id='hypertension'
                setValue={(id, value) => setSelectedOption(id, value)}
                initialCheck={hypertension}
              />
              <Checkbox
                text='Asma o enfermedad crónica pulmonar.'
                id='asthma'
                setValue={(id, value) => setSelectedOption(id, value)}
                initialCheck={asthma}
              />
              <Checkbox
                text='Tratamiento por cáncer o alguna medicación inmunosupresora.'
                id='cancer'
                setValue={(id, value) => setSelectedOption(id, value)}
                initialCheck={cancer}
              />
              <Checkbox
                text='Deficiencias en el sistema inmune heredadas.'
                id='immuneDeficiency'
                setValue={(id, value) => setSelectedOption(id, value)}
                initialCheck={immuneDeficiency}
              />
              <Checkbox
                text='VIH.'
                id='HIV'
                setValue={(id, value) => setSelectedOption(id, value)}
                initialCheck={HIV}
              />
              <Checkbox
                text='Condiciones cardíacas severas.'
                id='heartCondition'
                setValue={(id, value) => setSelectedOption(id, value)}
                initialCheck={heartCondition}
              />
              <Checkbox
                text='Diabetes.'
                id='diabetes'
                setValue={(id, value) => setSelectedOption(id, value)}
                initialCheck={diabetes}
              />
              <Checkbox
                text='Insuficiencia renal.'
                id='renalInsufficiency'
                setValue={(id, value) => setSelectedOption(id, value)}
                initialCheck={renalInsufficiency}
              />
              <Checkbox
                text='Cirrosis hepática.'
                id='hepaticCirrhosis'
                setValue={(id, value) => setSelectedOption(id, value)}
                initialCheck={hepaticCirrhosis}
              />
              <Checkbox
                text='Enfermedades o condiciones que hacen más difícil toser.'
                id='hardCough'
                setValue={(id, value) => setSelectedOption(id, value)}
                initialCheck={hardCough}
              />
              <Checkbox
                text='Obesidad.'
                id='obesity'
                setValue={(id, value) => setSelectedOption(id, value)}
                initialCheck={obesity}
              />
              <Checkbox
                text='Desnutrición.'
                id='malnutrition'
                setValue={(id, value) => setSelectedOption(id, value)}
                initialCheck={malnutrition}
              />
              <Checkbox
                text='Falcemia.'
                id='sickleCellAnemia'
                setValue={(id, value) => setSelectedOption(id, value)}
                initialCheck={sickleCellAnemia}
              />
              <Checkbox
                text='Tuberculosis.'
                id='tuberculosis'
                setValue={(id, value) => setSelectedOption(id, value)}
                initialCheck={tuberculosis}
              />
              <Checkbox
                text='Embarazo.'
                id='pregnancy'
                setValue={(id, value) => setSelectedOption(id, value)}
                initialCheck={pregnancy}
              />
              <Checkbox
                text='Ninguno de los anteriores'
                id='none'
                setValue={(id, value) => {
                  setGlobalState({
                    type: 'ADD_ANSWERS',
                    value: {
                      asthma: false,
                      cancer: false,
                      HIV: false,
                      heartCondition: false,
                      diabetes: false,
                      renalInsufficiency: false,
                      hepaticCirrhosis: false,
                      hardCough: false,
                      obesity: false,
                      pregnancy: false,
                      immuneDeficiency: false,
                      malnutrition: false,
                      sickleCellAnemia: false,
                      tuberculosis: false,
                      hypertension: false,
                      none: value,
                    },
                  });
                }}
                initialCheck={none}
              />
            </View>
          </ScrollView>
        </View>
      </Content>
    </Container>
  );
};

export default StepMedicalConditions;
