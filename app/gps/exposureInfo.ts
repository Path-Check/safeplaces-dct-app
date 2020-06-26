import { AppState, EventSubscription } from 'react-native';

import { ExposureInfo } from '../exposureHistory';

type Foo = string;

type Event = "onGPSExposureInfoUpdated"

type Subscriber = (data: ExposureInfo) => void

interface GPSExposureInfoEventEmitter {
  subscribers: Subscriber[]
  dispatch: (event: Event, data: ExposureInfo) => void
  subscribe: (event: Event, callback: Subscriber) => void
}

const GPSExposureInfoEventEmitter = {
  subscribers: Subscriber,
  dispatch: function (event: Event, data: ExposureInfo) {
    this.subscribers.forEach((subscriber: Subscriber) => {
      subscriber(data)
    })
  },
  subscribe: function (event: Event, subscriber: Subscriber) => void) {
    this.subscribers.push(subscriber)
  }

}

export const subscribeToExposureEvents = (
  cb: (exposureInfo: ExposureInfo) => void,
): EventSubscription => {
  MYFOO.addEventListener('onGPSExpsoureInfoUpdated', (foo: Foo[]) => {
    cb(toExposureInfo(foo));
  });
  return {
    remove: () => {
      MFOO.removeEventListener('onGPSExpsoureInfoUpdated')
    }
  }
};

const toExposureInfo = (foo: Foo[]): ExposureInfo => {
  return [];
};
