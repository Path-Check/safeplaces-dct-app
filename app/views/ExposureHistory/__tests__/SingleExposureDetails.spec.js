import React from 'react';
import { render } from '@testing-library/react-native';
import moment from 'moment';

import { SingleExposureDetail } from '../SingleExposureDetail';

const FIXED_DATE = moment('2020-04-11').startOf('day');

it('matches snapshot', () => {
  const { asJSON } = render(
    <SingleExposureDetail date={FIXED_DATE} exposureMinutes={5} />,
  );

  expect(asJSON()).toMatchSnapshot();
});
