import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, View } from 'react-native';

/**
 * @typedef { import("./Assessment").SurveyQuestion } SurveyQuestion
 * @typedef { import("./Assessment").SurveyOption } SurveyOption
 */
import imageHealth from '../../assets/images/assessment/icon-health.png';
import imagePrivate from '../../assets/images/assessment/icon-private.png';
import imageBanner from '../../assets/images/assessment/illustration-screening-start.png';
import imageCdc from '../../assets/images/assessment/logo-cdc.png';
import imageMit from '../../assets/images/assessment/logo-mit-media-lab.png';
import { Typography } from '../../components/Typography';
import Colors from '../../constants/colors';
import i18n from '../../locales/languages';
import {
  OPTION_VALUE_AGREE,
  OPTION_VALUE_DISAGREE,
  QUESTION_KEY_AGREE,
  SCREEN_TYPE_RADIO,
} from './constants';
import AssessmentEnd from './endScreens/AssessmentEnd';

/** @type {React.FunctionComponent<{}>} */
const AssessmentStart = ({ navigation }) => {
  let { t } = useTranslation();
  return (
    <AssessmentEnd
      ctaAction={() => {
        navigation.push('Question', {
          question: agreeQuestion,
          option: agreeOption,
        });
      }}
      ctaTitle={t('assessment.start_cta')}
      image={imageBanner}
      pretitle={<Pretitle />}
      title={t('assessment.start_title')}>
      <View>
        <View style={styles.description}>
          <Image source={imageHealth} style={styles.descriptionImage} />
          <Typography use='body1' style={styles.descriptionText}>
            {t('assessment.start_description_1')}
          </Typography>
        </View>
        <View style={styles.description}>
          <Image source={imagePrivate} style={styles.descriptionImage} />
          <Typography use='body1' style={styles.descriptionText}>
            {t('assessment.start_description_2')}
          </Typography>
        </View>
      </View>
    </AssessmentEnd>
  );
};

function Pretitle() {
  return (
    <View style={styles.logos}>
      <Image
        source={imageCdc}
        style={{ width: 47, height: 29, marginRight: 10 }}
      />
      <Image source={imageMit} style={{ width: 58, height: 32 }} />
    </View>
  );
}

/** @type {SurveyQuestion} */
const agreeQuestion = {
  option_key: QUESTION_KEY_AGREE,
  question_description: i18n.t('assessment.agree_question_description'),
  question_key: QUESTION_KEY_AGREE,
  question_text: i18n.t('assessment.agree_question_text'),
  question_type: 'TEXT',
  required: true,
  screen_type: SCREEN_TYPE_RADIO,
};

/** @type {SurveyOption} */
const agreeOption = {
  key: QUESTION_KEY_AGREE,
  values: [
    {
      label: i18n.t('assessment.agree_option_agree'),
      value: OPTION_VALUE_AGREE,
    },
    {
      label: i18n.t('assessment.agree_option_disagree'),
      value: OPTION_VALUE_DISAGREE,
    },
  ],
};

export default AssessmentStart;

const styles = StyleSheet.create({
  logos: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    marginBottom: 10,
  },
  description: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
    paddingHorizontal: 10,
  },
  descriptionImage: {
    width: 38,
    height: 38,
    marginRight: 20,
  },
  descriptionText: {
    flex: 1,
    color: Colors.BLACK,
  },
});
