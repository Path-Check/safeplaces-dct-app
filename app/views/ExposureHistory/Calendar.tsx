import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import dayjs from 'dayjs';

import { Typography } from '../../components/Typography';
import ExposureDatumIndicator from './ExposureDatumIndicator';
import {
  ExposureHistory,
  ExposureDatum,
} from '../../ExposureNotificationContext';

import { Spacing } from '../../styles';

interface CalendarProps {
  exposureHistory: ExposureHistory;
  onSelectDate: (exposureDatum: ExposureDatum) => void;
  selectedDatum: ExposureDatum;
}

const Calendar = ({
  exposureHistory,
  onSelectDate,
  selectedDatum,
}: CalendarProps): JSX.Element => {
  const lastMonth = dayjs().subtract(1, 'month');
  const title = `${lastMonth.format('MMMM')}/${dayjs().format('MMMM')}`;

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
                isSelected={datum.id === selectedDatum.id}
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

  return (
    <View style={styles.container}>
      <Typography use='headline3'>{title}</Typography>
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
    padding: Spacing.small,
  },
  calendarContainer: { flex: 1 },
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
