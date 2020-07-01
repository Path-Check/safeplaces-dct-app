import React from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, StyleSheet } from 'react-native';

import { Icons } from '../../../assets';
import { Button } from '../components/Button';
import { Info } from '../Info';
import { InfoText } from '../components/InfoText';

import { Colors } from '../../../styles';

/** @type {React.FunctionComponent<{}>} */
export const Emergency = () => {
  let { t } = useTranslation();
  
  // TODO: This would need to be localized per country
  const handleEmergencyCall = () => Linking.openURL('tel://911')

  return (
    <Info
      backgroundColor={Colors.primaryBackgroundFaintShade}
      icon={Icons.SelfAssessment} // TODO: Placeholder, replace when we get icon
      scrollStyle={styles.containerItemsAlignment}
      footer={<EmergencyButton title={t('assessment.emergency_cta')} onPress={handleEmergencyCall} />}>
        <InfoText useTitleStyle='headline2'
          title={t('assessment.emergency_title')}
          description={t('assessment.emergency_description')}
          titleStyle={styles.title}
          descriptionStyle={styles.description} />
    </Info>
  
  );
};

const EmergencyButton = ({title, onPress}) => (
  <Button buttonStyle={styles.button}
    onPress={onPress}
    title={title}
    backgroundColor={Colors.white}
    textColor={Colors.black} />
)

const styles = StyleSheet.create({
  containerItemsAlignment: {
    alignItems: 'center'
  },
  title: {
    textAlign: 'center'
  },
  description: {
    textAlign: 'center',
    fontSize: 18,
    lineHeight: 24
  },
  button: {
    borderWidth: 2, 
    borderColor: Colors.emergencyRed
  }
});
