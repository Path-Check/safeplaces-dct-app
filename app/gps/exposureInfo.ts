import { ExposureInfo } from '../exposureHistory';
import { toExposureInfo, DayBins } from '../gps/intersect/exposureHistory';

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

export const getCurrentExposures = async (
  _cb: (exposureInfo: ExposureInfo) => void,
): Promise<void> => {};

export const subscribeToExposureEvents = (
  cb: (exposureHistory: ExposureInfo) => void,
): { remove: () => void } => {
  return ExposureEvents.addListener(
    'onGPSExposureInfoUpdated',
    (dayBins: DayBins) => {
      cb(toExposureInfo(dayBins));
    },
  );
};

export const emitResultDayBins = (dayBins: DayBins): void => {
  ExposureEvents.emit(dayBins);
};
