/**
 * @format
 */

import 'react-native';
import 'isomorphic-fetch';

import { render } from '../tets-utils';
import React from 'react';

import { UnconnectedApp } from '../App';
import { FeatureFlagOption } from '../app/store/types';

jest.mock('../app/Entry', () => ({ Entry: 'Entry' }));

// We're using the unconnected App, so omit creating a store.
jest.mock('../app/store', () => ({ createPersistedStore: () => ({}) }));

it('renders correctly', () => {
  const { asJSON } = render(<UnconnectedApp />, {
    initialState: {
      featureFlags: { flags: { [FeatureFlagOption.EXPOSURE_MODE]: false } },
    },
  });

  expect(asJSON()).toMatchSnapshot();
});
