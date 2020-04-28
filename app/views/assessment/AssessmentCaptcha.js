import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import AssessmentEnd from './AssessmentEnd';
import AssessmentOption from './AssessmentOption';

/** @type {React.FunctionComponent<{}>} */
const AssessmentCaptcha = () => {
  let { t } = useTranslation();
  let [a, setA] = useState(true);
  let [b, setB] = useState(true);
  return (
    <AssessmentEnd
      ctaAction={() => {}}
      ctaTitle={t('assessment.captcha_cta')}
      description=''
      footer={
        <View/>
      }
      image={require('../../assets/images/illustration-screening-data-sharing.png')}
      title={t('assessment.captcha_title')}>
      <AssessmentOption
        onSelect={() => setA(a => !a)}
        option={{
          label: t('assessment.share_screening_title'),
          description: t('assessment.share_screening_description'),
          value: 'a',
        }}
        selected={a}
        type='CHECKBOX'
      />
      <AssessmentOption
        onSelect={() => setB(b => !b)}
        option={{
          label: t('assessment.share_location_title'),
          description: t('assessment.share_location_description'),
          value: 'b',
        }}
        selected={b}
        type='CHECKBOX'
      />
    </AssessmentEnd>
  );
};

export default AssessmentCaptcha;

const styles = StyleSheet.create({
  skip: {
    color: Colors.DARK_GRAY,
    fontFamily: Fonts.primaryRegular,
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
});
