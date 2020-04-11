import React from 'react';
import { render } from '@testing-library/react-native';
import { SingleExposureDetail } from '../SingleExposureDetail';

it('matches snapshot', () => {
  const { asJSON } = render(
    <SingleExposureDetail daysAgo={0} exposureTime={5} />,
  );

  expect(asJSON()).toMatchSnapshot();
});
