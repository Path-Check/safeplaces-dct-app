import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { Icons } from '../../../assets';
import { Typography } from '../../../components/Typography';
import Colors from '../../../constants/colors';
import { Info } from '../Info';

/** @type {React.FunctionComponent<{}>} */
export const Share = ({ navigation }) => {
  const { t } = useTranslation();

  return (
    <Info
      ctaAction={() => {
        navigation.push('EndComplete');
      }}
      icon={Icons.AnonymizedDataInverted}
      backgroundColor={Colors.SECONDARY_10}
      ctaTitle={t('assessment.share_cta')}
      description={
        <>
          <Trans t={t} i18nKey='assessment.share_description'>
            <Typography />
          </Trans>
        </>
      }
      title={t('assessment.share_title')}
    />
  );
};
