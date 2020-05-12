import 'react-native';

import { render, wait } from '@testing-library/react-native';
import React from 'react';

import { GetStoreData } from '../../helpers/General';
import News from '../News';

jest.mock('../../helpers/General', () => {
  return {
    GetStoreData: jest.fn(),
  };
});

beforeEach(() => {
  GetStoreData.mockResolvedValue('[]');
});

it('renders correctly', async () => {
  const { asJSON } = render(<News />);

  await wait();

  expect(asJSON()).toMatchSnapshot();
});
