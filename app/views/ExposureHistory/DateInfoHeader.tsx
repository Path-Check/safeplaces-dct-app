import React, { FunctionComponent } from 'react';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Typography } from '../../components/Typography';
import { Typography as TypographyStyles } from '../../styles';

const DateInfoHeader: FunctionComponent = () => {
  const { t } = useTranslation();
  return (
    <Typography style={styles.subHeaderText}>
      {t('exposure_history.last_days')}
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
