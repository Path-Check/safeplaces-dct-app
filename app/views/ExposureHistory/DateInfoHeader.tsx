import React, { FunctionComponent, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

import { Typography } from '../../components/Typography';
import { Typography as TypographyStyles } from '../../styles';
import ExposureHistoryContext from '../../ExposureHistoryContext';

const DateInfoHeader: FunctionComponent = () => {
  const { t } = useTranslation();
  const { lastExposureDetectionDate } = useContext(ExposureHistoryContext);

  if (lastExposureDetectionDate === null) {
    return null;
  }

  const lastDaysText = t('exposure_history.last_days');
  const updated = t('exposure_history.updated');
  let updatedAtText = '';

  if (lastExposureDetectionDate !== null) {
    const humanizedTimePassed = lastExposureDetectionDate.fromNow();
    updatedAtText = ` • ${updated} ${humanizedTimePassed}`;
  }

  return (
    <Typography style={styles.subHeaderText}>
      <>
        {lastDaysText}
        {updatedAtText}
      </>
    </Typography>
  );
};

const styles = StyleSheet.create({
  subHeaderText: {
    ...TypographyStyles.header4,
    ...TypographyStyles.bold,
  },
});

export default DateInfoHeader;
