import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { Icons, Images } from '../../../assets';
import { MetaContext } from '../Context';
import { Info } from '../Info';
import { InfoText } from '../components/InfoText';
import { Button } from '../components/Button';

import { Colors } from '../../../styles';

/** @type {React.FunctionComponent<{}>} */
export const Isolate = ({ navigation }) => {
  let { t } = useTranslation();
  let { completeRoute } = useContext(MetaContext);

  const handleButtonPress = () => navigation.push(completeRoute);

  return (
    <Info
      backgroundColor={Colors.primaryBackgroundFaintShade}
      backgroundImage={Images.IsolatePathBackground}
      icon={Icons.Isolate}
      footer={
        <Button
          onPress={handleButtonPress}
          title={t('assessment.isolate_cta')}
        />
      }>
      <InfoText
        useTitleStyle='headline2'
        title={t('assessment.isolate_title')}
        description={t('assessment.isolate_description')}
      />
    </Info>
  );
};
