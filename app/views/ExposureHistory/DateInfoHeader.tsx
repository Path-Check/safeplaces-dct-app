import React, {
  FunctionComponent,
  useState,
  useEffect,
  useContext,
} from 'react';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import dayjs, { Dayjs } from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

import { Typography } from '../../components/Typography';
import { Typography as TypographyStyles } from '../../styles';
import { fetchLastExposureDetectionDate } from '../../bt/nativeModule';
import ExposureHistoryContext from '../../ExposureHistoryContext';

const DateInfoHeader: FunctionComponent = () => {
  const [
    lastExposureDetectionDate,
    setLastExposureDetectionDate,
  ] = useState<Dayjs | null>(null);
  const { t } = useTranslation();
  const { exposureHistory } = useContext(ExposureHistoryContext);

  useEffect(() => {
    fetchLastExposureDetectionDate().then((exposureDetectionDate) => {
      setLastExposureDetectionDate(exposureDetectionDate);
    });
  }, [exposureHistory]);

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
