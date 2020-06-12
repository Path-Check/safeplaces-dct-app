import { Container, Content, Text } from 'native-base';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

import Checkbox from '../../../../components/DR/Checkbox';
import styles from '../../../../components/DR/Header/style';
import context from '../../../../components/DR/Reduces/context';

const StepMedicalConditions = ({ setCompleted }) => {
  const { t } = useTranslation();

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
                {t('report.med_conditions.med_cond_title')}
              </Text>
              <Checkbox
                text={t('report.med_conditions.hypertension')}
                id='hypertension'
                setValue={(id, value) => setSelectedOption(id, value)}
                initialCheck={hypertension}
              />
              <Checkbox
                text={t('report.med_conditions.asthma')}
                id='asthma'
                setValue={(id, value) => setSelectedOption(id, value)}
                initialCheck={asthma}
              />
              <Checkbox
                text={t('report.med_conditions.cancer')}
                id='cancer'
                setValue={(id, value) => setSelectedOption(id, value)}
                initialCheck={cancer}
              />
              <Checkbox
                text={t('report.med_conditions.immuneDeficiency')}
                id='immuneDeficiency'
                setValue={(id, value) => setSelectedOption(id, value)}
                initialCheck={immuneDeficiency}
              />
              <Checkbox
                text={t('report.med_conditions.HIV')}
                id='HIV'
                setValue={(id, value) => setSelectedOption(id, value)}
                initialCheck={HIV}
              />
              <Checkbox
                text={t('report.med_conditions.heartCondition')}
                id='heartCondition'
                setValue={(id, value) => setSelectedOption(id, value)}
                initialCheck={heartCondition}
              />
              <Checkbox
                text={t('report.med_conditions.diabetes')}
                id='diabetes'
                setValue={(id, value) => setSelectedOption(id, value)}
                initialCheck={diabetes}
              />
              <Checkbox
                text={t('report.med_conditions.renalInsufficiency')}
                id='renalInsufficiency'
                setValue={(id, value) => setSelectedOption(id, value)}
                initialCheck={renalInsufficiency}
              />
              <Checkbox
                text={t('report.med_conditions.hepaticCirrhosis')}
                id='hepaticCirrhosis'
                setValue={(id, value) => setSelectedOption(id, value)}
                initialCheck={hepaticCirrhosis}
              />
              <Checkbox
                text={t('report.med_conditions.hardCough')}
                id='hardCough'
                setValue={(id, value) => setSelectedOption(id, value)}
                initialCheck={hardCough}
              />
              <Checkbox
                text={t('report.med_conditions.obesity')}
                id='obesity'
                setValue={(id, value) => setSelectedOption(id, value)}
                initialCheck={obesity}
              />
              <Checkbox
                text={t('report.med_conditions.malnutrition')}
                id='malnutrition'
                setValue={(id, value) => setSelectedOption(id, value)}
                initialCheck={malnutrition}
              />
              <Checkbox
                text={t('report.med_conditions.sickleCellAnemia')}
                id='sickleCellAnemia'
                setValue={(id, value) => setSelectedOption(id, value)}
                initialCheck={sickleCellAnemia}
              />
              <Checkbox
                text={t('report.med_conditions.tuberculosis')}
                id='tuberculosis'
                setValue={(id, value) => setSelectedOption(id, value)}
                initialCheck={tuberculosis}
              />
              <Checkbox
                text={t('report.med_conditions.pregnancy')}
                id='pregnancy'
                setValue={(id, value) => setSelectedOption(id, value)}
                initialCheck={pregnancy}
              />
              <Checkbox
                text={t('report.med_conditions.none')}
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
