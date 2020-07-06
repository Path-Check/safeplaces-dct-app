import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import ExportTemplate from './ExportTemplate';
import { useStrategyContent } from '../../TracingStrategyContext';
import { Screens } from '../../navigation';
import * as BTNativeModule from '../nativeModule';

const PublishConsent = (): JSX.Element => {
  const navigation = useNavigation();
  const [isConsenting, setIsConsenting] = useState(false);
  const { t } = useTranslation();

  const { StrategyCopy, StrategyAssets } = useStrategyContent();

  const consent = async () => {
    setIsConsenting(true);
    const cb = (_errorMessage: string, _successMessage: string) => {
      navigation.navigate(Screens.AffectedUserComplete);
      setIsConsenting(false);
    };
    BTNativeModule.submitDiagnosisKeys(cb);
  };

  return (
    <ExportTemplate
      onNext={consent}
      icon={StrategyAssets.exportPublishIcon}
      headline={StrategyCopy.exportPublishTitle}
      body={t('export.publish_consent_body_bluetooth')}
      nextButtonLabel={t('export.consent_button_title')}
      buttonLoading={isConsenting}
    />
  );
};

export default PublishConsent;
