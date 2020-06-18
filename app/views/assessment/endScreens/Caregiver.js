import React, { useContext } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { Icons, Images } from '../../../assets';
import { Typography } from '../../../components/Typography';
import { MetaContext } from '../Context';
import { Info } from '../Info';

import { Colors } from '../../../styles';

/** @type {React.FunctionComponent<{}>} */
export const Caregiver = ({ navigation }) => {
  let { t } = useTranslation();
  let { completeRoute } = useContext(MetaContext);
  return (
    <Info
      ctaAction={() => {
        navigation.push(completeRoute);
      }}
      backgroundColor={Colors.primaryBackgroundFaintShade}
      backgroundImage={Images.IsolatePathBackground}
      icon={Icons.Isolate}
      ctaTitle={t('assessment.caregiver_cta')}
      description={
        <Trans t={t} i18nKey='assessment.caregiver_description'>
          <Typography />
        </Trans>
      }
      title={t('assessment.caregiver_title')}
    />
  );
};
