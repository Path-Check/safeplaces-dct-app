import React from 'react';
import { render, wait } from '@testing-library/react-native';
import dayjs from 'dayjs';
import '@testing-library/jest-native/extend-expect';

import DateInfoHeader from './DateInfoHeader';
import * as nativeModule from '../../bt/nativeModule';

jest.mock('../../bt/nativeModule');

describe('DateInfoHeader', () => {
  it('displays the time since the last exposure detection', async () => {
    const lastExposureDetectionDate = dayjs().subtract(8, 'hour');
    jest
      .spyOn(nativeModule, 'fetchLastExposureDetectionDate')
      .mockResolvedValueOnce(lastExposureDetectionDate);

    const { getByText } = render(<DateInfoHeader />);

    await wait(() => {
      expect(
        getByText(' • Updated 8 hours ago', { exact: false }),
      ).toBeDefined();
    });
  });

  describe('when there is not an exposure detection date', () => {
    it('does not displays an updated at info', async () => {
      jest
        .spyOn(nativeModule, 'fetchLastExposureDetectionDate')
        .mockResolvedValueOnce(null);

      const { queryByText } = render(<DateInfoHeader />);

      await wait(() => {
        expect(queryByText('Updated')).toBeNull();
      });
    });
  });
});
