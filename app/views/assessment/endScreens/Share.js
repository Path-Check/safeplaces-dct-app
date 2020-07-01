import React from 'react';
import { useTranslation } from 'react-i18next';

import { Icons } from '../../../assets';
import { Typography } from '../../../components/Typography';
import { Info } from '../Info';

import { Colors } from '../../../styles';

import { AUTHORITY_NAME as authority }  from '../../../constants/authorities';

/** @type {React.FunctionComponent<{}>} */
export const Share = ({ navigation }) => {
  const { t } = useTranslation();

  return (
    <Info
      ctaAction={() => {
        navigation.push('AssessmentComplete');
      }}
      icon={Icons.AnonymizedDataInverted}
      backgroundColor={Colors.primaryBackgroundFaintShade}
      ctaTitle={t('assessment.share_cta')}
      description={
        <>
          <Typography>
            {t('assessment.share_description', {authority})}
          </Typography>
        </>
      }
      title={t('assessment.share_title')}
    />
  );
};
