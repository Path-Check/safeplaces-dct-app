import 'react-native';

import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import { act, render } from '@testing-library/react-native';
import React from 'react';

import LocationTracking from '../LocationTracking';

const navigationMock = {
  addListener: jest.fn(),
};

jest.mock('../../constants/DR/baseUrls', () => ({
  MEPYD_C5I_API_URL: 'contact_tracing/api',
  MEPYD_C5I_SERVICE: 'https://webapps.mepyd.gob.do',
  GOV_DO_TOKEN: '',
}));

beforeEach(() => {
  BackgroundGeolocation.checkStatus.mockReturnValue(jest.fn());
  BackgroundGeolocation.configure.mockReturnValue(jest.fn());
});

it('renders correctly', async () => {
  const { asJSON } = render(<LocationTracking navigation={navigationMock} />);

  await act(async () => {
    expect(asJSON()).toMatchSnapshot();
  });
});
