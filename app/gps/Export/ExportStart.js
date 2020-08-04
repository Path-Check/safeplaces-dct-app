import React from 'react';
import { useTranslation } from 'react-i18next';

import ExportTemplate from './ExportTemplate';
import { Screens } from '../../navigation';

export const ExportStart = ({ navigation }) => {
  const { t } = useTranslation();

  const onNext = () => {
    navigation.navigate(Screens.ExportFlow);
  };

  return (
    <ExportTemplate
      onNext={onNext}
      headline={t('export.start_title')}
      body={t('export.start_body')}
      nextButtonLabel={t('common.start')}
      ignoreModalStyling // this is in a tab
    />
  );
};

export default ExportStart;
