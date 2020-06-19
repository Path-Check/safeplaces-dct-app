import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

import { ExposureHistory, ExposureDatum } from '../../exposureHistory';
import { Typography } from '../../components/Typography';
import ExposureDatumIndicator from './ExposureDatumIndicator';

import {
  Colors,
  Buttons,
  Spacing,
  Typography as TypographyStyles,
} from '../../styles';

interface CalendarProps {
  exposureHistory: ExposureHistory;
  onSelectDate: (exposureDatum: ExposureDatum) => void;
  selectedDatum: ExposureDatum | null;
}

const Calendar = ({
  exposureHistory,
  onSelectDate,
  selectedDatum,
}: CalendarProps): JSX.Element => {
  const { t } = useTranslation();
  const lastMonth = dayjs().subtract(1, 'month');
  const title = `${lastMonth.format('MMMM')} | ${dayjs().format(
    'MMMM',
  )}`.toUpperCase();

  const week1 = exposureHistory.slice(0, 7);
  const week2 = exposureHistory.slice(7, 14);
  const week3 = exposureHistory.slice(14, 21);

  interface CalendarRowProps {
    week: ExposureHistory;
  }

  const CalendarRow = ({ week }: CalendarRowProps) => {
    return (
      <View style={styles.calendarRow}>
        {week.map((datum: ExposureDatum) => {
          return (
            <TouchableOpacity
              key={`calendar-day-${datum.date}`}
              onPress={() => onSelectDate(datum)}>
              <ExposureDatumIndicator
                isSelected={
                  selectedDatum ? datum.date === selectedDatum.date : false
                }
                exposureDatum={datum}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const DayLabels = () => {
    const labels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    return (
      <View style={styles.calendarRow}>
        {labels.map((label: string, idx: number) => {
          return (
            <View style={styles.labelStyle} key={`calendar-label-${idx}`}>
              <Text>{label}</Text>
            </View>
          );
        })}
      </View>
    );
  };

  const handleOnPressLegend = () => {};
  const legendButtonText = t('exposure_history.legend_button');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Typography style={styles.monthText}>{title}</Typography>
        <TouchableOpacity
          onPress={handleOnPressLegend}
          style={styles.legendButton}>
          <Typography style={styles.legendButtonText}>
            {legendButtonText}
          </Typography>
        </TouchableOpacity>
      </View>
      <View style={styles.calendarContainer}>
        <DayLabels />
        <CalendarRow week={week1} />
        <CalendarRow week={week2} />
        <CalendarRow week={week3} />
      </View>
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
  },
  monthText: {
    ...TypographyStyles.label,
    color: Colors.secondaryHeaderText,
  },
  legendButton: {
    ...Buttons.tinyTeritiaryRounded,
    borderWidth: 1,
  },
  legendButtonText: {
    ...TypographyStyles.buttonTextTinyDark,
  },
  calendarContainer: { flex: 1, paddingVertical: Spacing.small },
  calendarRow: {
    flex: 1,
    paddingVertical: Spacing.xSmall,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 36,
  },
});

export default Calendar;
