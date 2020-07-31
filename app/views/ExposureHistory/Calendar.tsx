import React, { useState } from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import localeData from 'dayjs/plugin/localeData';

import { ExposureHistory, ExposureDatum } from '../../exposureHistory';
import { Typography } from '../../components/Typography';
import ExposureDatumIndicator from './ExposureDatumIndicator';
import LegendModal from './LegendModal';

import {
  Buttons,
  Colors,
  Spacing,
  Typography as TypographyStyles,
} from '../../styles';
import { daysAgo, isInFuture } from '../../helpers/dateTimeUtils';

interface CalendarProps {
  exposureHistory: ExposureHistory;
  onSelectDate: (exposureDatum: ExposureDatum) => void;
  selectedDatum: ExposureDatum | null;
}

type ModalState = 'Open' | 'Closed';

const Calendar = ({
  exposureHistory,
  onSelectDate,
  selectedDatum,
}: CalendarProps): JSX.Element => {
  const { t } = useTranslation();
  const [legendModal, setLegendModal] = useState<ModalState>('Closed');

  const week1 = exposureHistory.slice(0, 7);
  const week2 = exposureHistory.slice(7, 14);
  const week3 = exposureHistory.slice(14, 21);

  const firstDate = dayjs(week1[0].date);
  const lastDate = dayjs(week3[6].date);

  const title = `${firstDate.format('MMMM')} | ${lastDate.format(
    'MMMM',
  )}`.toUpperCase();

  interface CalendarRowProps {
    week: ExposureHistory;
  }

  const CalendarRow = ({ week }: CalendarRowProps) => {
    return (
      <View style={styles.calendarRow}>
        {week.map((datum: ExposureDatum) => {
          const isSelected = datum.date === selectedDatum?.date;
          const isOlderThan14Days = datum.date < daysAgo(14);
          const isFuture = isInFuture(datum.date);
          const disabled = isOlderThan14Days || isFuture;

          return (
            <TouchableOpacity
              disabled={disabled}
              key={`calendar-day-${datum.date}`}
              testID={`calendar-day-${datum.date}`}
              onPress={() => onSelectDate(datum)}>
              <ExposureDatumIndicator
                disabled={disabled}
                isSelected={isSelected}
                exposureDatum={datum}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const extendedDayjs = dayjs.extend(localeData);

  const DayLabels = () => {
    const labels = extendedDayjs
      .localeData()
      .weekdays()
      .map((dayName: string) => dayName[0].toLocaleUpperCase());
    return (
      <View style={styles.calendarRow}>
        {labels.map((label: string, idx: number) => {
          return (
            <View style={styles.labelStyle} key={`calendar-label-${idx}`}>
              <Text style={styles.labelTextStyle}>{label}</Text>
            </View>
          );
        })}
      </View>
    );
  };

  const handleOnPressLegend = () => {
    setLegendModal('Open');
  };

  const handleOnCloseModal = () => {
    setLegendModal('Closed');
  };

  return (
    <View testID={'exposure-history-calendar'} style={styles.container}>
      <View style={styles.header}>
        <Typography style={styles.monthText}>{title}</Typography>
        <TouchableOpacity
          onPress={handleOnPressLegend}
          style={styles.legendButton}>
          <Typography style={styles.legendText}>
            {t('exposure_history.legend_button')}
          </Typography>
        </TouchableOpacity>
      </View>
      <View style={styles.calendarContainer}>
        <DayLabels />
        <CalendarRow week={week1} />
        <CalendarRow week={week2} />
        <CalendarRow week={week3} />
      </View>
      <LegendModal
        status={legendModal}
        handleOnCloseModal={handleOnCloseModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  monthText: {
    ...TypographyStyles.label,
    ...TypographyStyles.bold,
    color: Colors.secondaryHeaderText,
  },
  legendButton: {
    ...Buttons.tinyTeritiaryRounded,
  },
  legendText: {
    ...TypographyStyles.label,
    ...TypographyStyles.bold,
    color: Colors.secondaryHeaderText,
  },
  calendarContainer: {
    flex: 1,
    paddingVertical: Spacing.small,
  },
  calendarRow: {
    flex: 1,
    paddingVertical: Spacing.xxSmall,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: Spacing.xHuge,
  },
  labelTextStyle: {
    ...TypographyStyles.label,
  },
});

export default Calendar;
