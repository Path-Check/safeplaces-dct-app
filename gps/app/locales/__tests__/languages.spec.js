import { NativeModules } from 'react-native';

import * as languages from '../languages';

const BACKUP_SETTINGS_MANAGER = NativeModules.SettingsManager;

const setDeviceLocale = locale => {
  NativeModules.SettingsManager = {
    settings: { AppleLocale: locale },
    I18nManager: { localeIdentifier: locale },
  };
};

describe('supportedDeviceLanguageOrEnglish()', () => {
  afterEach(() => {
    NativeModules.SettingsManager = BACKUP_SETTINGS_MANAGER;
  });

  it('resolves device locale en -> en', () => {
    setDeviceLocale('en');
    expect(languages.supportedDeviceLanguageOrEnglish()).toBe('en');
  });

  it('resolves device locale en_US -> en', () => {
    setDeviceLocale('en_US');
    expect(languages.supportedDeviceLanguageOrEnglish()).toBe('en');
  });

  it('resolves device locale en-US -> en', () => {
    setDeviceLocale('en-US');
    expect(languages.supportedDeviceLanguageOrEnglish()).toBe('en');
  });

  it('resolves device locale en-us -> en', () => {
    setDeviceLocale('en-us');
    expect(languages.supportedDeviceLanguageOrEnglish()).toBe('en');
  });

  it('resolves device locale zh_Hant -> zh_Hant', () => {
    setDeviceLocale('zh_Hant');
    expect(languages.supportedDeviceLanguageOrEnglish()).toBe('zh_Hant');
  });

  it('resolves device locale zh-Hant -> zh_Hant', () => {
    setDeviceLocale('zh-Hant');
    expect(languages.supportedDeviceLanguageOrEnglish()).toBe('zh_Hant');
  });

  it('resolves unknown device locale xx-yy -> en', () => {
    setDeviceLocale('xx0-yy');
    expect(languages.supportedDeviceLanguageOrEnglish()).toBe('en');
  });
});
