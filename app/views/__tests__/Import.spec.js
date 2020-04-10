import { fireEvent, render, NativeTestEvent, act } from '@testing-library/react-native'
import 'react-native';
import {Linking} from 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import Import from '../Import';

jest.spyOn(console, 'log').mockImplementation(() => {});

const GoogleTakeOutAutoImport = require('../../helpers/GoogleTakeOutAutoImport');
const General = require('../../helpers/General');

const navigationMock = {
  goBack: jest.fn()
};
const openURLSpy = jest.spyOn(Linking, 'openURL').mockImplementation(() => Promise.resolve());
const importTakeoutDataSpy = jest.spyOn(GoogleTakeOutAutoImport, 'importTakeoutData')
  .mockImplementation(() => Promise.resolve([]));
const pickFileSpy = jest.spyOn(General, 'pickFile')
  .mockImplementation(() => Promise.resolve('file://tmp/test.zip'));

describe('Import component', () => {
  afterAll(() => {
    openURLSpy.mockReset();
    openURLSpy.mockRestore();
    jest.resetModules();
  });

  it('renders correctly', () => {
    const tree = renderer
    .create(<Import navigation={navigationMock} />)
    .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('clicking on Google Takeout button leads to open browser page', () => {
    const { getByTestId } = render(<Import navigation={navigationMock} />)
    fireEvent(getByTestId('google-takeout-link'), new NativeTestEvent('press'));
    expect(openURLSpy).toHaveBeenCalled();
  });

  it('clicking on import Takeout button opens a file picker', async () => {
    const {getByTestId} = render(<Import navigation={navigationMock} />)
    await act(async () => {
      await fireEvent(getByTestId('google-takeout-import-btn'), new NativeTestEvent('press'));
    });
    expect(pickFileSpy).toHaveBeenCalled();
    expect(importTakeoutDataSpy).toHaveBeenCalled();
  });
})

