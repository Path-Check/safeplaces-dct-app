import React from 'react';
import { useTranslation } from 'react-i18next';

import { useStatusBarEffect } from '../../navigation';
import { useStrategyContent } from '../../TracingStrategyContext';
import DescriptionTemplate from '../common/DescriptionTemplate';

interface PersonalPrivacyProps {
  navigation: any;
}

const PersonalPrivacy = ({ navigation }: PersonalPrivacyProps): JSX.Element => {
  useStatusBarEffect('dark-content');
  const { t } = useTranslation();
  const { StrategyAssets, StrategyCopy } = useStrategyContent();

  const descriptionTemplateContent = {
    backgroundImage: StrategyAssets.personalPrivacyBackground,
    icon: StrategyAssets.personalPrivacyIcon,
    header: StrategyCopy.personalPrivacyHeader,
    body: StrategyCopy.personalPrivacySubheader,
    primaryButtonLabel: t('label.launch_next'),
  };

  const descriptionTemplateActions = {
    primaryButtonOnPress: () => navigation.replace('NotificatioNDetails'),
  };

  return (
    <DescriptionTemplate
      descriptionTemplateContent={descriptionTemplateContent}
      descriptionTemplateActions={descriptionTemplateActions}
    />
  );
};

export default PersonalPrivacy;
