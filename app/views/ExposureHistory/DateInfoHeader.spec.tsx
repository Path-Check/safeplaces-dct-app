import React from 'react';
import { render, wait } from '@testing-library/react-native';
// import dayjs from 'dayjs';
import '@testing-library/jest-native/extend-expect';

import DateInfoHeader from './DateInfoHeader';
import ExposureHistoryContext, {
  initialState,
} from '../../ExposureHistoryContext';

describe('DateInfoHeader', () => {
  //  TODO: reintroduce this test when we display this
  // it('displays the time since the last exposure detection', async () => {
  //   const lastExposureDetectionDate = dayjs().subtract(8, 'hour');

  //   const { getByText } = render(
  //     <ExposureHistoryContext.Provider
  //       value={{ ...initialState, lastExposureDetectionDate }}>
  //       <DateInfoHeader />
  //     </ExposureHistoryContext.Provider>,
  //   );

  //   await wait(() => {
  //     expect(
  //       getByText(' • Updated 8 hours ago', { exact: false }),
  //     ).toBeDefined();
  //   });
  // });

  describe('when there is not an exposure detection date', () => {
    it('does not displays the date info', async () => {
      const { queryByText } = render(
        <ExposureHistoryContext.Provider
          value={{ ...initialState, lastExposureDetectionDate: null }}>
          <DateInfoHeader />
        </ExposureHistoryContext.Provider>,
      );

      await wait(() => {
        expect(queryByText('Updated')).toBeNull();
      });
    });
  });
});
