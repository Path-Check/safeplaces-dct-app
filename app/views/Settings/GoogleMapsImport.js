import styled from '@emotion/native';
import React from 'react';
import { SvgXml } from 'react-native-svg';

import googleMapsIcon from '../../assets/svgs/google-maps-logo';
import ButtonWrapper from '../../components/ButtonWrapper';
import { Typography } from '../../components/Typography';
import Colors from '../../constants/colors';
import languages from '../../locales/languages';

export const GoogleMapsImport = ({ navigation }) => {
  const importPressed = () => {
    if (__DEV__) {
      navigation.navigate('ImportScreen');
    }
  };

  return (
    <>
      <TitleRow>
        <SvgXml xml={googleMapsIcon} />
        <Title use='body1'>{languages.t('label.maps_import_title')}</Title>
      </TitleRow>

      <ParagraphContainer>
        <Typography use='body2'>
          {languages.t('label.maps_import_text')}
        </Typography>
      </ParagraphContainer>

      <ButtonWrapper
        title={
          __DEV__ ? languages.t('label.maps_import_button_text') : 'Coming soon'
        }
        onPress={importPressed}
        buttonColor={Colors.VIOLET}
        bgColor={Colors.WHITE}
        borderColor={Colors.VIOLET}
        buttonWidth={'100%'}
      />

      <ParagraphContainer>
        <Typography use='body3' secondary monospace>
          {languages.t('label.maps_import_disclaimer')}
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
