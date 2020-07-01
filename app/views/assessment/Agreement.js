import React from 'react';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import { InfoText } from './components/InfoText';
import { Button } from './components/Button';
import { Info } from './Info';
import { Typography } from '../../components/Typography';
import { Colors } from '../../styles';
import { Icons } from '../../assets';

/** @type {React.FunctionComponent<{}>} */
export const Agreement = ({ navigation }) => {
  let { t } = useTranslation();

  const handleAgreementPress = () => navigation.push('EmergencyAssessment');

  return (
    <Info
      backgroundColor={Colors.invertedQuaternaryBackground}
      icon={Icons.SelfAssessment}
      footer={
        <AgreementFooter
          description={t('assessment.agreement_footer')}
          buttonTitle={t('assessment.agreement_cta')}
          onPress={handleAgreementPress}
        />
      }>
      <InfoText
        useTitleStyle='headline3'
        useDescriptionStyle='body4'
        title={t('assessment.agreement_title')}
        description={t('assessment.agreement_description')}
      />
    </Info>
  );
};

const AgreementFooter = ({ description, onPress, buttonTitle }) => (
  <>
    <Button
      backgroundColor={Colors.white}
      textColor={Colors.black}
      onPress={onPress}
      title={buttonTitle}
    />
    <Typography style={styles.typographyStyle} use='body4'>
      {description}
    </Typography>
  </>
);

const styles = StyleSheet.create({
  typographyStyle: {
    paddingTop: 10,
  },
});
