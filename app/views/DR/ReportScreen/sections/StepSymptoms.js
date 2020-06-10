import 'moment/locale/es';

import moment from 'moment';
import { Container, Content, Text } from 'native-base';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

import CalendarButton from '../../../../components/DR/CalendarButton';
import Checkbox from '../../../../components/DR/Checkbox';
import styles from '../../../../components/DR/Header/style';
import context from '../../../../components/DR/Reduces/context';

const StepSymptoms = ({ setCompleted }) => {
  const { t } = useTranslation();

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
                {t('report.symptoms.symptoms_title')}
              </Text>
              <Checkbox
                text={t('report.symptoms.fever')}
                id='fever'
                setValue={(id, value) => setSelectedOption(id, value)}
                initialCheck={fever}
              />
              <Checkbox
                text={t('report.symptoms.difficultyBreathing')}
                id='difficultyBreathing'
                setValue={(id, value) => setSelectedOption(id, value)}
                initialCheck={difficultyBreathing}
              />
              <Checkbox
                text={t('report.symptoms.cough')}
                id='cough'
                setValue={(id, value) => setSelectedOption(id, value)}
                initialCheck={cough}
              />
              <Checkbox
                text={t('report.symptoms.soreThroat')}
                id='soreThroat'
                setValue={(id, value) => setSelectedOption(id, value)}
                initialCheck={soreThroat}
              />
              <Checkbox
                text={t('report.symptoms.bodyPain')}
                id='bodyPain'
                setValue={(id, value) => setSelectedOption(id, value)}
                initialCheck={bodyPain}
              />
              <Checkbox
                text={t('report.symptoms.threwUp')}
                id='threwUp'
                setValue={(id, value) => setSelectedOption(id, value)}
                initialCheck={threwUp}
              />
              <Checkbox
                text={t('report.symptoms.runnyNose')}
                id='runnyNose'
                setValue={(id, value) => setSelectedOption(id, value)}
                initialCheck={runnyNose}
              />
              <Checkbox
                text={t('report.symptoms.headache')}
                id='headache'
                setValue={(id, value) => setSelectedOption(id, value)}
                initialCheck={headache}
              />
              <Checkbox
                text={t('report.symptoms.chestPain')}
                id='chestPain'
                setValue={(id, value) => setSelectedOption(id, value)}
                initialCheck={chestPain}
              />
              <Checkbox
                text={t('report.symptoms.convulsions')}
                id='convulsions'
                setValue={(id, value) => setSelectedOption(id, value)}
                initialCheck={convulsions}
              />
              <Checkbox
                text={t('report.symptoms.disorientation')}
                id='disorientation'
                setValue={(id, value) => setSelectedOption(id, value)}
                initialCheck={disorientation}
              />
              <Checkbox
                text={t('report.symptoms.sleepiness')}
                id='sleepiness'
                setValue={(id, value) => setSelectedOption(id, value)}
                initialCheck={sleepiness}
              />
              <Checkbox
                text={t('report.symptoms.runnyNoseWithBlood')}
                id='runnyNoseWithBlood'
                setValue={(id, value) => setSelectedOption(id, value)}
                initialCheck={runnyNoseWithBlood}
              />
              <Checkbox
                text={t('report.symptoms.noSympthoms')}
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
