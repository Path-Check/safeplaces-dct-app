import { ExposureHistory, ExposureCalendarOptions } from '../exposureHistory';
import { DayBins, toExposureHistory } from './intersect/toExposureHistory';

type Event = 'onGPSExposureInfoUpdated';

type HandleOnDayBinsUpdated = (dayBins: DayBins) => void;

interface Subscriber {
  eventName: Event;
  callback: HandleOnDayBinsUpdated;
}

interface GPSExposureHistoryEventEmitter {
  subscriber: Subscriber | null;
  emit: (dayBins: DayBins) => void;
  addListener: (
    event: Event,
    callback: HandleOnDayBinsUpdated,
  ) => {
    remove: () => void;
  };
}

const ExposureEvents: GPSExposureHistoryEventEmitter = {
  subscriber: null,
  emit: function (dayBins: DayBins) {
    if (this.subscriber) {
      this.subscriber.callback(dayBins);
    }
  },
  addListener: function (event: Event, callback: HandleOnDayBinsUpdated) {
    const nextSubscriber: Subscriber = {
      eventName: event,
      callback,
    };
    this.subscriber = nextSubscriber;
    return {
      remove: () => {
        this.subscriber = null;
      },
    };
  },
};

export const subscribeToExposureEvents = (
  cb: (exposureHistory: ExposureHistory) => void,
  calendarConfig: ExposureCalendarOptions,
): { remove: () => void } => {
  return ExposureEvents.addListener(
    'onGPSExposureInfoUpdated',
    (dayBins: DayBins) => {
      cb(toExposureHistory(dayBins, calendarConfig));
    },
  );
};

export const emitResultDayBins = (dayBins: DayBins): void => {
  ExposureEvents.emit(dayBins);
};
