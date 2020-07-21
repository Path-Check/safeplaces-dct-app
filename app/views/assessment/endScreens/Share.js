import React from 'react';
import { useTranslation } from 'react-i18next';
import env from 'react-native-config';

import { Icons } from '../../../assets';
import { Info } from '../Info';
import { InfoText } from '../components/InfoText';
import { Button } from '../components/Button';

import { Colors } from '../../../styles';

const { GAEN_AUTHORITY_NAME: authority } = env;

/** @type {React.FunctionComponent<{}>} */
export const Share = ({ navigation }) => {
  const { t } = useTranslation();

  // TODO: Implement share logic
  const handleButtonPress = () => navigation.push('AssessmentComplete');

  return (
    <Info
      icon={Icons.AnonymizedDataInverted}
      backgroundColor={Colors.invertedSecondaryBackground}
      titleStyle='headline3'
      descriptionStyle='body4'
      footer={
        <Button
          onPress={handleButtonPress}
          title={t('assessment.share_cta')}
          backgroundColor={Colors.white}
          textColor={Colors.black}
        />
      }>
      <InfoText
        useTitleStyle='headline7'
        useDescriptionStyle='body4'
        title={t('assessment.share_title')}
        description={t('assessment.share_description', { authority })}
      />
    </Info>
  );
};
