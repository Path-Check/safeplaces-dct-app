import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import getHealthcareAuthorities from '../../store/actions/healthcareAuthorities/getHealthcareAuthoritiesAction';
import healthcareAuthorityOptionsSelector from '../../store/selectors/healthcareAuthorityOptionsSelector';
import { useAssets } from '../../TracingStrategyAssets';
import ExportTemplate from './ExportTemplate';
import { Icons } from '../../assets';
import { Screens } from '../../navigation';

export const ExportIntro = ({ navigation }) => {
  const { t } = useTranslation();
  const { exportStartTitle, exportStartBody } = useAssets();

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getHealthcareAuthorities());
  }, [dispatch]);
  const authorities = useSelector(healthcareAuthorityOptionsSelector);
  const selectedAuthorityDummy = authorities[0];

  const onNext = () => {
    if (selectedAuthorityDummy) {
      navigation.navigate(Screens.ExportCodeInput, {
        selectedAuthority: selectedAuthorityDummy,
      });
    } else {
      const fakeAuthority = {
        name: 'Boston Health Commission',
        bounds: {
          ne: {
            latitude: 42.0,
            longitude: 71.0,
          },
          sw: {
            latitude: 43.0,
            longitude: 72.0,
          },
        },
        org_id: '1234',
        cursor_url: '',
        public_api: '',
        internal_id: '',
      };
      navigation.navigate(Screens.ExportCodeInput, {
        selectedAuthority: fakeAuthority,
      });
    }
  };
  const onClose = () => navigation.goBack();

  return (
    <ExportTemplate
      onNext={onNext}
      onClose={onClose}
      icon={Icons.Heart}
      headline={exportStartTitle}
      body={exportStartBody}
      nextButtonLabel={t('common.start')}
      ignoreModalStyling // this is in a tab
    />
  );
};

export default ExportIntro;
