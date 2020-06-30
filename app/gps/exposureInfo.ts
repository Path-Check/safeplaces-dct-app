import { ExposureInfo } from '../exposureHistory';

type Event = 'onGPSExposureInfoUpdated';

type HandleOnExposureInfoUpdated = (data: ExposureInfo) => void;

interface Subscriber {
  eventName: Event;
  callback: HandleOnExposureInfoUpdated;
}

interface GPSExposureInfoEventEmitter {
  subscriber: Subscriber | null;
  emit: (event: Event, data: ExposureInfo) => void;
  addListener: (
    event: Event,
    callback: HandleOnExposureInfoUpdated,
  ) => {
    remove: () => void;
  };
}

const ExposureEvents: GPSExposureInfoEventEmitter = {
  subscriber: null,
  emit: function (event: Event, data: ExposureInfo) {
    if (this.subscriber) {
      this.subscriber.callback(data);
    }
  },
  addListener: function (event: Event, callback: HandleOnExposureInfoUpdated) {
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
  cb: (exposureInfo: ExposureInfo) => void,
): { remove: () => void } => {
  return ExposureEvents.addListener(
    'onGPSExposureInfoUpdated',
    (data: ExposureInfo) => {
      cb(data);
    },
  );
};

export const emitGPSExposureInfo = (exposureInfo: ExposureInfo): void => {
  ExposureEvents.emit('onGPSExposureInfoUpdated', exposureInfo);
};
