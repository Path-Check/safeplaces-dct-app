import { Container, Content, Text } from 'native-base';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';

import BulletItem from '../../../../components/DR/BulletItem';
import styles from '../../../../components/DR/Header/style';
import context from '../../../../components/DR/Reduces/context';
import ToggleButtons from '../../../../components/DR/ToggleButtons';

const StepHaveSymptoms = ({ setCompleted, sendData }) => {
  const { t } = useTranslation();

  const [
    {
      answers: { usage, haveSymptoms },
    },
    setGlobalState,
  ] = useContext(context);
  const haveSymp =
    usage === 'others'
      ? t('report.haveSymptoms.have_this_symptoms_others')
      : t('report.haveSymptoms.have_this_symptoms_myself');
  const haveNoSymp =
    usage === 'others'
      ? t('report.haveSymptoms.dont_have_this_symptoms_others')
      : t('report.haveSymptoms.dont_have_this_symptoms_myself');

  const [symptoms, setSymptoms] = useState(
    haveSymptoms == true ? haveSymp : haveSymptoms == false ? haveNoSymp : '',
  );
  if (symptoms) {
    setCompleted(true);
    sendData(symptoms);
  }

  const setSelectedOption = selected => {
    setSymptoms(selected);
    selected = selected === haveSymp ? true : false;
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
              <Text style={styles.subtitles}>
                {t('report.haveSymptoms.emergency_title')}
              </Text>
              <Text>
                {usage === 'others'
                  ? t('report.haveSymptoms.emergency_subtitle_others')
                  : t('report.haveSymptoms.emergency_subtitle_myself')}
              </Text>
              <BulletItem text={t('report.haveSymptoms.chest_pain')} />
              <BulletItem
                text={t('report.haveSymptoms.difficulty_breathing')}
              />
              <BulletItem text={t('report.haveSymptoms.dizziness')} />
              <BulletItem text={t('report.haveSymptoms.difficulty_speaking')} />
              <BulletItem text={t('report.haveSymptoms.difficulty_wakeup')} />
              <BulletItem text={t('report.haveSymptoms.convulsion')} />
              <BulletItem text={t('report.haveSymptoms.vomit')} />
              <BulletItem text={t('report.haveSymptoms.secretions')} />
              <View>
                <ToggleButtons
                  options={[haveSymp, haveNoSymp]}
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
