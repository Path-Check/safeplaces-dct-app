import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  StyleSheet,
  Platform,
  TouchableOpacity,
  TextInput,
  View,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Typography } from '../../components/Typography';
import { useAffectedUserContext } from './AffectedUserContext';
import * as API from './verificationAPI';
import * as NativeModule from '../nativeModule';
import { calculateHmac } from './hmac';

import { Screens } from '../../navigation';
import {
  Spacing,
  Buttons,
  Layout,
  Forms,
  Colors,
  Outlines,
  Typography as TypographyStyles,
} from '../../styles';

const defaultErrorMessage = ' ';

const CodeInputScreen = (): JSX.Element => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const {
    code,
    setCode,
    setExposureSubmissionCredentials,
  } = useAffectedUserContext();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(defaultErrorMessage);

  const isIOS = Platform.OS === 'ios';
  const codeLength = 8;

  const handleOnChangeText = (code: string) => {
    setErrorMessage('');
    setCode(code);
  };

  const handleOnPressCancel = () => {
    navigation.navigate(Screens.More);
  };

  const handleOnPressSubmit = async () => {
    setIsLoading(true);
    setErrorMessage(defaultErrorMessage);
    try {
      const response = await API.postCode(code);

      if (response.kind === 'success') {
        const token = response.body.token;
        const exposureKeys = await NativeModule.getExposureKeys();
        const [hmacDigest, hmacKey] = await calculateHmac(exposureKeys);

        const certResponse = await API.postTokenAndHmac(token, hmacDigest);

        if (certResponse.kind === 'success') {
          const certificate = certResponse.body.certificate;
          setExposureSubmissionCredentials(certificate, hmacKey);
          Keyboard.dismiss();
          navigation.navigate(Screens.AffectedUserPublishConsent);
        } else {
          setErrorMessage(showCertificateError(certResponse.error));
        }
      } else {
        setErrorMessage(showError(response.error));
      }
      setIsLoading(false);
    } catch (e) {
      Alert.alert(t('common.something_went_wrong'), e.message);
      setIsLoading(false);
    }
  };

  const showError = (error: API.CodeVerificationError): string => {
    switch (error) {
      case 'InvalidCode': {
        return t('export.error.invalid_code');
      }
      case 'VerificationCodeUsed': {
        return t('export.error.verification_code_used');
      }
      case 'InvalidVerificationUrl': {
        return 'Invalid Verification Url';
      }
      default: {
        return t('export.error.unknown_code_verification_error');
      }
    }
  };

  const showCertificateError = (error: API.TokenVerificationError): string => {
    switch (error) {
      case 'TokenMetaDataMismatch': {
        return 'token meta data mismatch';
      }
      default: {
        return t('export.error.unknown_code_verification_error');
      }
    }
  };

  const isDisabled = code.length !== codeLength;

  const buttonStyle = isDisabled ? styles.disabledButton : styles.button;
  const buttonTextStyle = isDisabled
    ? styles.disabledButtonText
    : styles.buttonText;

  return (
    <View style={styles.backgroundImage}>
      <SafeAreaView
        style={{ flex: 1 }}
        testID={'affected-user-code-input-screen'}>
        <KeyboardAvoidingView
          keyboardVerticalOffset={Spacing.tiny}
          behavior={isIOS ? 'padding' : undefined}>
          <View style={styles.container}>
            <View>
              <View style={styles.headerContainer}>
                <Typography style={styles.header}>
                  {t('export.code_input_title_bluetooth')}
                </Typography>

                <Typography style={styles.subheader}>
                  {t('export.code_input_body_bluetooth')}
                </Typography>
              </View>

              <View>
                <TextInput
                  testID={'code-input'}
                  value={code}
                  placeholder={'00000000'}
                  placeholderTextColor={Colors.placeholderTextColor}
                  maxLength={codeLength}
                  style={styles.codeInput}
                  keyboardType={'number-pad'}
                  returnKeyType={'done'}
                  onChangeText={handleOnChangeText}
                  blurOnSubmit={false}
                  onSubmitEditing={Keyboard.dismiss}
                />
              </View>

              <Typography style={styles.errorSubtitle} use='body2'>
                {errorMessage}
              </Typography>
            </View>
            {isLoading ? <LoadingIndicator /> : null}

            <View>
              <TouchableOpacity
                onPress={handleOnPressSubmit}
                accessible
                accessibilityLabel={t('common.submit')}
                accessibilityRole='button'
                disabled={isDisabled}
                style={buttonStyle}>
                <Typography style={buttonTextStyle}>
                  {t('common.submit')}
                </Typography>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleOnPressCancel}
                style={styles.secondaryButton}>
                <Typography style={styles.secondaryButtonText}>
                  {t('export.code_input_button_cancel')}
                </Typography>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const LoadingIndicator = () => {
  return (
    <View style={styles.activityIndicatorContainer}>
      <ActivityIndicator
        size={'large'}
        color={Colors.darkGray}
        style={styles.activityIndicator}
        testID={'loading-indicator'}
      />
    </View>
  );
};

const indicatorWidth = 120;

const styles = StyleSheet.create({
  backgroundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    backgroundColor: Colors.faintGray,
  },
  container: {
    height: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.medium,
    paddingTop: Layout.oneTenthHeight,
    backgroundColor: Colors.primaryBackgroundFaintShade,
  },
  headerContainer: {
    marginBottom: Spacing.xxxHuge,
  },
  header: {
    ...TypographyStyles.header2,
    marginBottom: Spacing.xxSmall,
  },
  subheader: {
    ...TypographyStyles.header4,
    color: Colors.secondaryText,
  },
  errorSubtitle: {
    ...TypographyStyles.header4,
    color: Colors.errorText,
    paddingTop: Spacing.xxSmall,
  },
  codeInput: {
    ...Forms.textInput,
  },
  activityIndicatorContainer: {
    position: 'absolute',
    zIndex: Layout.level1,
    left: Layout.halfWidth,
    top: Layout.halfHeight,
    marginLeft: -(indicatorWidth / 2),
    marginTop: -(indicatorWidth / 2),
  },
  activityIndicator: {
    width: indicatorWidth,
    height: indicatorWidth,
    backgroundColor: Colors.transparentDarkGray,
    borderRadius: Outlines.baseBorderRadius,
  },
  button: {
    ...Buttons.primary,
  },
  buttonText: {
    ...TypographyStyles.buttonTextPrimary,
  },
  disabledButton: {
    ...Buttons.primaryDisabled,
  },
  disabledButtonText: {
    ...TypographyStyles.buttonTextPrimaryDisabled,
  },
  secondaryButton: {
    ...Buttons.secondary,
  },
  secondaryButtonText: {
    ...TypographyStyles.buttonTextSecondary,
  },
});

export default CodeInputScreen;
