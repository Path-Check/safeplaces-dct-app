import 'moment/locale/es';

import moment from 'moment';
import { Container, Content, Text } from 'native-base';
import React, { useContext } from 'react';
import { ScrollView, View } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

import CalendarButton from '../../../../components/DR/CalendarButton';
import Checkbox from '../../../../components/DR/Checkbox';
import styles from '../../../../components/DR/Header/style';
import context from '../../../../components/DR/Reduces/context';

const StepSymptoms = ({ setCompleted }) => {
  const [
    {
      answers: {
        dateIllnessStarted,
        fever,
        difficultyBreathing,
        cough,
        soreThroat,
        bodyPain,
        threwUp,
        noSympthoms,
        headache,
        runnyNose,
        chestPain,
        convulsions,
        disorientation,
        sleepiness,
        runnyNoseWithBlood,
        showDateButton,
      },
    },
    setGlobalState,
  ] = useContext(context);

  const setSelectedOption = (option, selected) => {
    setGlobalState({
      type: 'ADD_ANSWERS',
      value: { [option]: selected, noSympthoms: false, showDateButton: true },
    });
  };
  if (
    fever ||
    difficultyBreathing ||
    cough ||
    soreThroat ||
    bodyPain ||
    threwUp ||
    headache ||
    runnyNose ||
    chestPain ||
    convulsions ||
    disorientation ||
    sleepiness ||
    runnyNoseWithBlood ||
    noSympthoms
  ) {
    setCompleted(true);
  } else {
    setCompleted(false);
  }
  const minimum = new Date().setDate(new Date().getDate() - 35);
  return (
    <Container>
      <Content>
        <View>
          <ScrollView>
            <View style={styles.formContainer}>
              <Text style={[styles.subtitles, { marginVertical: hp('3%') }]}>
                ¿Presenta alguno de estos síntomas? *
              </Text>
              <Checkbox
                text='Fiebre, escalofríos o sudor'
                id='fever'
                setValue={(id, value) => setSelectedOption(id, value)}
                initialCheck={fever}
              />
              <Checkbox
                text='Dificultad para respirar, no severa'
                id='difficultyBreathing'
                setValue={(id, value) => setSelectedOption(id, value)}
                initialCheck={difficultyBreathing}
              />
              <Checkbox
                text='Tos nueva o que ha empeorado'
                id='cough'
                setValue={(id, value) => setSelectedOption(id, value)}
                initialCheck={cough}
              />
              <Checkbox
                text='Dolor de garganta'
                id='soreThroat'
                setValue={(id, value) => setSelectedOption(id, value)}
                initialCheck={soreThroat}
              />
              <Checkbox
                text='Dolor en el cuerpo'
                id='bodyPain'
                setValue={(id, value) => setSelectedOption(id, value)}
                initialCheck={bodyPain}
              />
              <Checkbox
                text='Vómito o diarrea'
                id='threwUp'
                setValue={(id, value) => setSelectedOption(id, value)}
                initialCheck={threwUp}
              />
              <Checkbox
                text='Secreción nasal'
                id='runnyNose'
                setValue={(id, value) => setSelectedOption(id, value)}
                initialCheck={runnyNose}
              />
              <Checkbox
                text='Dolor de cabeza'
                id='headache'
                setValue={(id, value) => setSelectedOption(id, value)}
                initialCheck={headache}
              />
              <Checkbox
                text='Dolor de pecho'
                id='chestPain'
                setValue={(id, value) => setSelectedOption(id, value)}
                initialCheck={chestPain}
              />
              <Checkbox
                text='Convulsiones'
                id='convulsions'
                setValue={(id, value) => setSelectedOption(id, value)}
                initialCheck={convulsions}
              />
              <Checkbox
                text='Desorientación'
                id='disorientation'
                setValue={(id, value) => setSelectedOption(id, value)}
                initialCheck={disorientation}
              />
              <Checkbox
                text='Somnolencia'
                id='sleepiness'
                setValue={(id, value) => setSelectedOption(id, value)}
                initialCheck={sleepiness}
              />
              <Checkbox
                text='Secreciones nasales o por boca con sangre'
                id='runnyNoseWithBlood'
                setValue={(id, value) => setSelectedOption(id, value)}
                initialCheck={runnyNoseWithBlood}
              />
              <Checkbox
                text='Ninguno de los anteriores'
                id='noSympthoms'
                setValue={(id, value) => {
                  setGlobalState({
                    type: 'ADD_ANSWERS',
                    value: {
                      fever: false,
                      difficultyBreathing: false,
                      cough: false,
                      soreThroat: false,
                      bodyPain: false,
                      threwUp: false,
                      showDateButton: false,
                      headache: false,
                      runnyNose: false,
                      chestPain: false,
                      convulsions: false,
                      disorientation: false,
                      sleepiness: false,
                      runnyNoseWithBlood: false,
                      [id]: value,
                    },
                  });
                }}
                initialCheck={noSympthoms}
              />
              {showDateButton && (
                <View>
                  <Text
                    style={[styles.subtitles, { marginVertical: hp('3%') }]}>
                    ¿Qué día empezó a tener síntomas? *
                  </Text>
                  <CalendarButton
                    date={moment(dateIllnessStarted).format('DD-MM-YYYY')}
                    onChange={date => {
                      setGlobalState({
                        type: 'ADD_ANSWERS',
                        value: {
                          dateIllnessStarted: moment(date, 'DD-MM-YYYY').format(
                            'YYYY-MM-DD',
                          ),
                        },
                      });
                    }}
                    minDate={moment(minimum)}
                  />
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </Content>
    </Container>
  );
};

export default StepSymptoms;
