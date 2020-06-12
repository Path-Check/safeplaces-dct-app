import { Container, Content, Text } from 'native-base';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

import Checkbox from '../../../../components/DR/Checkbox';
import styles from '../../../../components/DR/Header/style';
import context from '../../../../components/DR/Reduces/context';

const StepWorkInHealth = ({ setCompleted }) => {
  const { t } = useTranslation();

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

  return (
    <Container>
      <Content>
        <View>
          <ScrollView>
            <View style={styles.formContainer}>
              <Text style={[styles.subtitles, { marginVertical: hp('3%') }]}>
                {t('report.workInHealth.work_in_title')}
              </Text>
              <Text style={styles.text}>
                {t('report.workInHealth.work_in_subtitle')}
              </Text>
              <Checkbox
                text={
                  usage === 'others'
                    ? t('report.workInHealth.work_health_others')
                    : t('report.workInHealth.work_health_myself')
                }
                id='workInHealth'
                setValue={(id, value) => setSelectedOption(id, value)}
                initialCheck={workInHealth}
              />
              <Checkbox
                text={
                  usage === 'others'
                    ? t('report.workInHealth.worked_health_others')
                    : t('report.workInHealth.worked_health_myself')
                }
                id='workedInHealth'
                setValue={(id, value) => setSelectedOption(id, value)}
                initialCheck={workedInHealth}
              />
              <Checkbox
                text={
                  usage === 'others'
                    ? t('report.workInHealth.plan_work_others')
                    : t('report.workInHealth.plan_work_myself')
                }
                id='planWorkInHealth'
                setValue={(id, value) => setSelectedOption(id, value)}
                initialCheck={planWorkInHealth}
              />
              <Checkbox
                text={
                  usage === 'others'
                    ? t('report.workInHealth.doesnt_work_others')
                    : t('report.workInHealth.doesnt_work_myself')
                }
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
