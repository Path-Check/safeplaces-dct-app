import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import image from '../../../assets/images/assessment/illustration-screening-data-sharing.png';
import { Typography } from '../../../components/Typography';
import Colors from '../../../constants/colors';
import Fonts from '../../../constants/fonts';
import AssessmentOption from '../AssessmentOption';
import { SCREEN_TYPE_CHECKBOX } from '../constants';
import AssessmentEnd, { assessmentStyles } from './AssessmentEnd';

/** @type {React.FunctionComponent<{}>} */
const AssessmentEndShare = ({ navigation }) => {
  const { t } = useTranslation();
  const [endOptionA, setEndOptionA] = useState(true);
  const [endOptionB, setEndOptionB] = useState(true);
  return (
    <AssessmentEnd
      ctaAction={() => {
        navigation.push('Captcha');
      }}
      ctaTitle={t('assessment.share_cta')}
      description={
        <Trans t={t} i18nKey='assessment.share_description'>
          <Typography />
          <Typography surveyFont style={assessmentStyles.boldBlackText} />
        </Trans>
      }
      footer={
        <TouchableOpacity
          onPress={() => {
            navigation.push('EndComplete');
          }}>
          <Text style={styles.skip}>{t('assessment.share_cta_skip')}</Text>
        </TouchableOpacity>
      }
      image={image}
      title={t('assessment.share_title')}>
      <AssessmentOption
        onSelect={() => setEndOptionA(endOptionA => !endOptionA)}
        option={{
          label: t('assessment.share_screening_title'),
          description: t('assessment.share_screening_description'),
          value: 'a',
        }}
        isSelected={endOptionA}
        type={SCREEN_TYPE_CHECKBOX}
      />
      <AssessmentOption
        onSelect={() => setEndOptionB(endOptionB => !endOptionB)}
        option={{
          label: t('assessment.share_location_title'),
          description: t('assessment.share_location_description'),
          value: 'b',
        }}
        isSelected={endOptionB}
        type={SCREEN_TYPE_CHECKBOX}
      />
    </AssessmentEnd>
  );
};

export default AssessmentEndShare;

const styles = StyleSheet.create({
  skip: {
    color: Colors.DARK_GRAY,
    fontFamily: Fonts.primaryRegular,
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
});
