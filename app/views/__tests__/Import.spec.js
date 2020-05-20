import 'react-native';

import {
  NativeTestEvent,
  act,
  fireEvent,
  render,
} from '@testing-library/react-native';
import React from 'react';
import { Linking } from 'react-native';
import renderer from 'react-test-renderer';

import Import from '../Import';

jest.spyOn(console, 'log').mockImplementation(() => {});

const GoogleTakeOutAutoImport = require('../../helpers/GoogleTakeOutAutoImport');
const General = require('../../helpers/General');

const navigationMock = {
  goBack: jest.fn(),
};
let openURLSpy;
let importTakeoutDataSpy;
let pickFileSpy;

describe('Import component', () => {
  beforeAll(() => {
    openURLSpy = jest
      .spyOn(Linking, 'openURL')
      .mockImplementation(() => Promise.resolve());
    importTakeoutDataSpy = jest
      .spyOn(GoogleTakeOutAutoImport, 'importTakeoutData')
      .mockImplementation(() => Promise.resolve([]));
    pickFileSpy = jest
      .spyOn(General, 'pickFile')
      .mockImplementation(() => Promise.resolve('file://tmp/test.zip'));
  });
  afterAll(() => {
    openURLSpy.mockRestore();
    importTakeoutDataSpy.mockRestore();
    pickFileSpy.mockRestore();
  });

  it('renders correctly', () => {
    const tree = renderer
      .create(<Import navigation={navigationMock} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('clicking on Google Takeout button leads to open browser page', () => {
    const { getByTestId } = render(<Import navigation={navigationMock} />);
    fireEvent(getByTestId('google-takeout-link'), new NativeTestEvent('press'));
    expect(openURLSpy).toHaveBeenCalled();
  });

  it('clicking on import Takeout button opens a file picker', async () => {
    const { getByTestId } = render(<Import navigation={navigationMock} />);
    await act(async () => {
      await fireEvent(
        getByTestId('google-takeout-import-btn'),
        new NativeTestEvent('press'),
      );
    });
    expect(pickFileSpy).toHaveBeenCalled();
    expect(importTakeoutDataSpy).toHaveBeenCalled();
  });
});
