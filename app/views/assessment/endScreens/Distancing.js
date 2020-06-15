import React, { useContext } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { Icons, Images } from '../../../assets';
import { Typography } from '../../../components/Typography';
import { MetaContext } from '../Context';
import { Info } from '../Info';

import { Colors } from '../../../styles';

/** @type {React.FunctionComponent<{}>} */
export const Distancing = ({ navigation }) => {
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
      ctaTitle={t('assessment.distancing_cta')}
      description={
        <Trans t={t} i18nKey='assessment.distancing_description'>
          <Typography />
        </Trans>
      }
      title={t('assessment.distancing_title')}
    />
  );
};
