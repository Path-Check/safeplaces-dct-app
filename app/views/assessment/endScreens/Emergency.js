import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Linking, View } from 'react-native';

import { Icons, Images } from '../../../assets';
import { Button } from '../Button';
import { Typography } from '../../../components/Typography';
import { Info } from '../Info';

import { Colors } from '../../../styles';

/** @type {React.FunctionComponent<{}>} */
export const Emergency = () => {
  let { t } = useTranslation();
  return (
    <Info
      ctaAction={() => {
        // TODO: This would need to be localized per country
        Linking.openURL('tel:911');
      }}
      backgroundColor={Colors.primaryBackgroundFaintShade}
      //backgroundImage={Images.IsolatePathBackground}
      icon={Icons.Warning}
      scrollStyle={{alignItems: 'center'}}
      description={
        <Trans t={t} i18nKey='assessment.emergency_description'>
          <Typography />
        </Trans>
      }
      title={t('assessment.emergency_title')}
      footer={<EmergencyButton title={t('assessment.emergency_cta')} />}
    />
  );
};

const EmergencyButton = ({title, onPress}) => (
  <Button buttonStyle={{borderWidth: 2, borderColor: Colors.emergencyRed}}
    onPress={onPress}
    title={title}
    backgroundColor={Colors.white}
    textColor={Colors.black} />
)

// TODO: Finish refactoring this
const EmergencyInfo = () => (
  <View>
    <Typography
      //use={titleStyle}
      style={[assessmentStyles.headingSpacing]}>
      {title}
    </Typography>
    <Typography
      //use={descriptionStyle}
      style={assessmentStyles.description}
      testID='description'>
      {description}
    </Typography>
  </View>
)
