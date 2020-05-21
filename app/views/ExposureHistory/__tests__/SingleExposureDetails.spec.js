import { render } from '@testing-library/react-native';
import dayjs from 'dayjs';
import React from 'react';

import { SingleExposureDetail } from '../SingleExposureDetail';

const FIXED_DATE = dayjs('2020-04-11').startOf('day');

it('matches snapshot', () => {
  const { asJSON } = render(
    <SingleExposureDetail date={FIXED_DATE} exposureMinutes={5} />,
  );

  expect(asJSON()).toMatchSnapshot();
});
