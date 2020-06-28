import { ExposureInfo } from '../exposureHistory';

type Event = 'onGPSExposureInfoUpdated';

type HandleOnExposureInfoUpdated = (data: ExposureInfo) => void;

interface Subscriber {
  eventName: Event;
  callback: HandleOnExposureInfoUpdated;
}

interface GPSExposureInfoEventEmitter {
  subscribers: Subscriber[];
  emit: (event: Event, data: ExposureInfo) => void;
  addListener: (
    event: Event,
    callback: HandleOnExposureInfoUpdated,
  ) => {
    remove: () => void;
  };
}

const ExposureEvents: GPSExposureInfoEventEmitter = {
  subscribers: [],
  emit: function (event: Event, data: ExposureInfo) {
    this.subscribers.forEach((subscriber: Subscriber) => {
      if (subscriber.eventName === event) {
        subscriber.callback(data);
      }
    });
  },
  addListener: function (event: Event, callback: HandleOnExposureInfoUpdated) {
    const nextSubscriber: Subscriber = {
      eventName: event,
      callback,
    };
    this.subscribers.push(nextSubscriber);
    return {
      remove: () => {
        this.subscribers = [];
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
