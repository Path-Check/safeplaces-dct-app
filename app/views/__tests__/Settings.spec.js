import 'react-native';

import { act, render } from '@testing-library/react-native';
import React from 'react';

import { getBuildtimeFlags } from '../../constants/flagsEnv';
import { FlagsProvider } from '../../helpers/Flags';
import * as languages from '../../locales/languages';
import { SettingsScreen } from '../Settings';

jest.mock('../../constants/flagsEnv', () => ({
  getBuildtimeFlags: jest.fn(),
}));

jest.mock('../../helpers/General', () => {
  return {
    GetStoreData: jest.fn().mockResolvedValue(true),
  };
});

jest.mock('../../COVIDSafePathsConfig', () => {
  return {
    isGPS: true,
  };
});

jest.useFakeTimers();

describe('<Settings />', () => {
  let BACKUP_LOCALE_LIST;
  let BACKUP_LOCALE_NAME;

  beforeEach(() => {
    BACKUP_LOCALE_LIST = languages.LOCALE_LIST;
    BACKUP_LOCALE_NAME = languages.LOCALE_NAME;
    languages.LOCALE_LIST = [
      { label: 'English', value: 'en' },
      { label: 'Other', value: 'ot' },
    ];
    languages.LOCALE_NAME = [{ en: 'English', ot: 'Other' }];

    jest.spyOn(languages, 'getUserLocaleOverride').mockResolvedValue(undefined);
    jest.spyOn(languages, 'setUserLocaleOverride').mockResolvedValue(undefined);
  });

  afterEach(() => {
    languages.LOCALE_LIST = BACKUP_LOCALE_LIST;
    languages.LOCALE_NAME = BACKUP_LOCALE_NAME;
  });

  it('renders correctly with google import flag', async () => {
    getBuildtimeFlags.mockReturnValue({ google_import: true });
    const { asJSON } = render(
      <FlagsProvider>
        <SettingsScreen />
      </FlagsProvider>,
    );

    await act(async () => {
      jest.runAllTimers();
    });

    await expect(asJSON()).toMatchSnapshot();
  });

  it('renders correctly without google import flag', async () => {
    getBuildtimeFlags.mockReturnValue({ google_import: false });

    const { asJSON } = render(
      <FlagsProvider>
        <SettingsScreen />
      </FlagsProvider>,
    );

    await act(async () => {
      jest.runAllTimers();
    });

    await expect(asJSON()).toMatchSnapshot();
  });
});
