import React, { useEffect, useState } from 'react';
import {
  TouchableOpacity,
  Image,
  ImageBackground,
  StyleSheet,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import {
  getLocaleList,
  getUserLocaleOverride,
  setUserLocaleOverride,
  supportedDeviceLanguageOrEnglish,
} from './../../locales/languages';
import { NativePicker } from '../../components/NativePicker';
import { Typography } from '../../components/Typography';
import EulaModal from './EulaModal';
import { useStatusBarEffect } from '../../navigation';

import { Images } from '../../assets';
import {
  Forms,
  Buttons,
  Spacing,
  Colors,
  Typography as TypographyStyles,
} from '../../styles';

type Agreement = 'Agreed' | 'NotAgreed';

const Onboarding = (): JSX.Element => {
  useStatusBarEffect('light-content');
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [locale, setLocale] = useState(supportedDeviceLanguageOrEnglish());
  const [modalVisible, setModalVisible] = useState(false);
  const [eulaAgreement, setEulaAgreement] = useState<Agreement>('NotAgreed');

  useEffect(() => {
    getUserLocaleOverride().then((locale) => {
      if (locale) {
        setLocale(locale);
      }
    });
  });

  const toggleCheckbox = () => {
    switch (eulaAgreement) {
      case 'Agreed': {
        setEulaAgreement('NotAgreed');
        break;
      }
      case 'NotAgreed': {
        setEulaAgreement('Agreed');
        break;
      }
    }
  };

  const onLocaleChange = async (locale: string) => {
    if (locale) {
      try {
        await setUserLocaleOverride(locale);
        setLocale(locale);
      } catch (err) {
        console.log('Something went wrong in language change', err);
      }
    }
  };

  const handleOnPressGetStarted = () => {
    if (eulaAgreement === 'Agreed') {
      navigation.navigate('Onboarding2');
    }
  };

  const handleOnCloseModal = () => {
    setModalVisible(false);
  };

  const handleOnPressTermsOfUse = () => {
    setModalVisible(true);
  };

  const showModal = modalVisible;
  const isDisabled = eulaAgreement !== 'Agreed';
  const isChecked = eulaAgreement === 'Agreed';
  const checkboxIcon = isChecked
    ? Images.BoxCheckedIcon
    : Images.BoxUncheckedIcon;
  const buttonStyle = isDisabled ? styles.disabledButton : styles.enabledButton;
  const buttonTextStyle = isDisabled
    ? styles.disabledButtonText
    : styles.enabledButtonText;

  const LanguageSelector = () => {
    return (
      <NativePicker
        items={getLocaleList()}
        value={locale}
        onValueChange={onLocaleChange}>
        {({ label, openPicker }: { label: string; openPicker: () => void }) => (
          <TouchableOpacity onPress={openPicker} style={styles.languageButton}>
            <Typography style={styles.languageSelectorText}>{label}</Typography>
          </TouchableOpacity>
        )}
      </NativePicker>
    );
  };

  return (
    <ImageBackground
      source={Images.LaunchScreenBackground}
      style={styles.backgroundImage}>
      <ImageBackground
        source={Images.LaunchScreenBackgroundOverlay}
        style={styles.backgroundImage}>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <LanguageSelector />
          </View>

          <View style={styles.bodyContainer}>
            <Typography style={styles.mainText}>
              {t('label.launch_screen1_header')}
            </Typography>
          </View>

          <View style={styles.footerContainer}>
            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                testID={'welcome-eula-checkbox'}
                style={styles.checkbox}
                onPress={toggleCheckbox}
                accessible
                accessibilityRole='checkbox'
                accessibilityLabel={t('onboarding.eula_message')}>
                <Image source={checkboxIcon} style={styles.checkboxIcon} />
              </TouchableOpacity>

              <View>
                <Typography style={styles.termsOfUseText}>
                  {t('onboarding.eula_message')}
                </Typography>
                <TouchableOpacity onPress={handleOnPressTermsOfUse}>
                  <Typography
                    style={styles.termsOfUseLinkText}
                    testID={'welcome-termsofuse-link'}>
                    {t('label.terms_of_use')}
                  </Typography>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={buttonStyle}
              testID={'welcome-button'}
              onPress={handleOnPressGetStarted}
              disabled={isDisabled}>
              <Typography style={buttonTextStyle}>
                {t('label.launch_get_started')}
              </Typography>
            </TouchableOpacity>
          </View>

          <EulaModal
            selectedLocale={locale}
            showModal={showModal}
            onCloseModal={handleOnCloseModal}
          />
        </View>
      </ImageBackground>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    padding: Spacing.large,
  },
  headerContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bodyContainer: {
    flex: 5,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  footerContainer: {
    flex: 2,
  },
  mainText: {
    ...TypographyStyles.header2,
    color: Colors.white,
  },
  languageButton: {
    ...Buttons.pill,
  },
  languageSelectorText: {
    ...TypographyStyles.label,
    color: Colors.white,
    textTransform: 'uppercase',
  },
  checkboxContainer: {
    flexDirection: 'row',
    paddingBottom: Spacing.medium,
  },
  checkbox: {
    ...Forms.checkbox,
  },
  checkboxIcon: {
    ...Forms.checkboxIcon,
  },
  termsOfUseLinkText: {
    ...TypographyStyles.linkYellow,
  },
  termsOfUseText: {
    ...TypographyStyles.description,
    color: Colors.invertedText,
  },
  enabledButton: {
    ...Buttons.largeWhite,
  },
  enabledButtonText: {
    ...TypographyStyles.buttonTextDark,
  },
  disabledButton: {
    ...Buttons.largeWhiteDisabled,
  },
  disabledButtonText: {
    ...TypographyStyles.buttonTextDarkDisabled,
  },
});

export default Onboarding;
