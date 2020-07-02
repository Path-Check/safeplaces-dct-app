import {
  ExposureHistory,
  ExposureInfo,
  calendarDays,
  Posix,
  ExposureCalendarOptions,
} from '../../exposureHistory';
import dayjs from 'dayjs';

export type DayBins = number[];

const toExposureInfo = (dayBins: DayBins, initDate: number): ExposureInfo => {
  return dayBins.reduce((exposureInfo: ExposureInfo, duration, index) => {
    const startOfDayAgo = dayjs(initDate)
      .startOf('day')
      .subtract(index, 'day')
      .valueOf();

    if (duration > 0) {
      exposureInfo[startOfDayAgo] = {
        kind: 'Possible',
        date: startOfDayAgo,
        duration: duration,
        totalRiskScore: 0,
        transmissionRiskLevel: 0,
      };
    } else if (duration === 0) {
      exposureInfo[startOfDayAgo] = {
        kind: 'NoKnown',
        date: startOfDayAgo,
      };
    } else {
      exposureInfo[startOfDayAgo] = {
        kind: 'NoData',
        date: startOfDayAgo,
      };
    }

    return exposureInfo;
  }, {});
};

export const toExposureHistory = (
  dayBins: DayBins,
  calendarOptions: ExposureCalendarOptions,
): ExposureHistory => {
  const { initDate, totalDays } = calendarOptions;
  const exposureInfo = toExposureInfo(dayBins, initDate);
  const calendar = calendarDays(initDate, totalDays);
  return calendar.map((date: Posix) => {
    if (exposureInfo[date]) {
      return exposureInfo[date];
    } else {
      return {
        kind: 'NoData',
        date,
      };
    }
  });
};
