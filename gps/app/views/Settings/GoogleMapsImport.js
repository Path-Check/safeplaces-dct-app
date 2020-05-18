import styled from '@emotion/native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { SvgXml } from 'react-native-svg';

import googleMapsIcon from '../../../../shared/assets/svgs/google-maps-logo';
import { Button } from '../../components/Button';
import { Typography } from '../../components/Typography';

export const GoogleMapsImport = ({ navigation }) => {
  const { t } = useTranslation();

  const importPressed = () => {
    navigation.navigate('ImportScreen');
  };

  return (
    <>
      <TitleRow>
        <SvgXml xml={googleMapsIcon} />
        <Title use='body1'>{t('import.google.title')}</Title>
      </TitleRow>

      <ParagraphContainer>
        <Typography secondary use='body2'>{t('import.subtitle')}</Typography>
      </ParagraphContainer>

      <Button
        secondary
        label={t('import.button_text')}
        onPress={importPressed}
      />

      <ParagraphContainer>
        <Typography use='body3' secondary monospace>
          {t('import.google.disclaimer')}
        </Typography>
      </ParagraphContainer>
    </>
  );
};

const TitleRow = styled.View`
  flex-direction: row;
  align-items: center;
  padding-top: 18px;
`;

const Title = styled(Typography)`
  font-size: 21px;
  margin-left: 8px;
`;

const ParagraphContainer = styled.View`
  padding: 20px 0;
`;
