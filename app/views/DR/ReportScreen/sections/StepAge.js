import { Container, Content, Text } from 'native-base';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

import styles from '../../../../components/DR/Header/style';
import context from '../../../../components/DR/Reduces/context';
import ToggleButtons from '../../../../components/DR/ToggleButtons';

const StepAge = ({ setCompleted }) => {
  const { t } = useTranslation();

  const [
    {
      answers: { sex },
    },
    setGlobalState,
  ] = useContext(context);
  const setSelectedOption = (selected, selection) => {
    setGlobalState({
      type: 'ADD_ANSWERS',
      value: { [selected]: selection },
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
              {t('report.sex.sex_title')}
            </Text>
            <ToggleButtons
              options={[t('report.sex.female'), t('report.sex.male')]}
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
