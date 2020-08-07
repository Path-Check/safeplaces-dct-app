import { cleanup, render } from '../../../test-utils/redux-provider';
import React from 'react';

import { AllServicesOnScreen } from '../AllServicesOn';
import { FeatureFlagOption } from '../../../store/types';

afterEach(cleanup);

jest.mock('react-native-pulse');

const navigationMock = {
  addListener: () => ({
    remove: () => {},
  }),
  navigate: () => {},
};

it('all services on matches snapshot', () => {
  const { asJSON } = render(
    <AllServicesOnScreen navigation={navigationMock} />,
    {
      initialState: {
        featureFlags: { flags: { [FeatureFlagOption.MOCK_EXPOSURE]: false } },
      },
    },
  );

  expect(asJSON()).toMatchSnapshot();
});
