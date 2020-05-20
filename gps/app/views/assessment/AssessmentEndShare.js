import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import image from '../../assets/images/assessment/illustration-screening-data-sharing.png';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import AssessmentEnd from './AssessmentEnd';
import AssessmentOption from './AssessmentOption';
import { SCREEN_TYPE_CHECKBOX } from './constants';

/** @type {React.FunctionComponent<{}>} */
const AssessmentEndShare = ({ navigation }) => {
  let { t } = useTranslation();
  let [a, setA] = useState(true);
  let [b, setB] = useState(true);
  return (
    <AssessmentEnd
      ctaAction={() => {
        navigation.push('Captcha');
      }}
      ctaTitle={t('assessment.share_cta')}
      description={
        <Trans i18nKey='assessment.share_description'>
          <Text />
          <Text style={{ fontFamily: Fonts.primaryBold }} />
          <Text style={{ fontFamily: Fonts.primaryBold }} />
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
        onSelect={() => setA(a => !a)}
        option={{
          label: t('assessment.share_screening_title'),
          description: t('assessment.share_screening_description'),
          value: 'a',
        }}
        selected={a}
        type={SCREEN_TYPE_CHECKBOX}
      />
      <AssessmentOption
        onSelect={() => setB(b => !b)}
        option={{
          label: t('assessment.share_location_title'),
          description: t('assessment.share_location_description'),
          value: 'b',
        }}
        selected={b}
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
