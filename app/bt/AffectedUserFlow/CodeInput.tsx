import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  View,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '../../components/Button';
import { Typography } from '../../components/Typography';
import { useAffectedUserContext } from './AffectedUserContext';

import { Screens } from '../../navigation';
import {
  Spacing,
  Buttons,
  Layout,
  Forms,
  Colors,
  Typography as TypographyStyles,
} from '../../styles';

const CODE_LENGTH = 8;

const CodeInputScreen = (): JSX.Element => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const { code, setCode } = useAffectedUserContext();
  const [isCheckingCode, setIsCheckingCode] = useState(false);
  const [codeInvalid, setCodeInvalid] = useState(false);

  const length = CODE_LENGTH;

  const handleOnChangeText = (code: string) => {
    setCode(code);
  };

  const handleOnPressNext = async () => {
    setIsCheckingCode(true);
    setCodeInvalid(false);
    try {
      const valid = code === '12345678';

      if (valid) {
        navigation.navigate(Screens.AffectedUserPublishConsent);
      } else {
        setCodeInvalid(true);
      }
      setIsCheckingCode(false);
    } catch (e) {
      Alert.alert(t('common.something_went_wrong'), e.message);
      setIsCheckingCode(false);
    }
  };

  return (
    <View style={styles.backgroundImage}>
      <SafeAreaView
        style={{ flex: 1 }}
        testID={'affected-user-code-input-screen'}>
        <KeyboardAvoidingView behavior={'padding'} style={styles.container}>
          <View style={styles.headerContainer}>
            <Typography style={styles.header}>
              {t('export.code_input_title_bluetooth')}
            </Typography>

            <Typography use='body1'>
              {t('export.code_input_body_bluetooth')}
            </Typography>

            {/* there's a flex end bug on android, this is a hack to ensure some spacing */}
            <View
              style={{
                flexGrow: 1,
                marginVertical: Platform.OS === 'ios' ? 0 : 10,
              }}>
              <View style={styles.codeInputContainer}>
                <TextInput
                  testID={'code-input'}
                  value={code}
                  maxLength={length}
                  style={styles.codeInput}
                  keyboardType={'number-pad'}
                  returnKeyType={'done'}
                  onChangeText={handleOnChangeText}
                  blurOnSubmit={false}
                />
              </View>

              {codeInvalid && (
                <Typography style={styles.errorSubtitle} use='body2'>
                  {t('export.code_input_error')}
                </Typography>
              )}
            </View>

            <Button
              loading={isCheckingCode}
              label={t('common.next')}
              onPress={handleOnPressNext}
              style={styles.button}
              textStyle={styles.buttonText}
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.medium,
    paddingTop: Layout.oneTenthHeight,
    backgroundColor: Colors.primaryBackgroundFaintShade,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    backgroundColor: Colors.faintGray,
    flex: 1,
  },
  headerContainer: {
    flex: 1,
    marginBottom: Spacing.large,
  },
  header: {
    ...TypographyStyles.header2,
  },
  errorSubtitle: {
    marginTop: Spacing.medium,
    color: Colors.errorText,
  },
  codeInputContainer: {
    flex: 1,
    paddingVertical: Spacing.large,
  },
  codeInput: {
    ...Forms.textInput,
  },
  button: {
    ...Buttons.largeBlue,
  },
  buttonText: {
    ...TypographyStyles.buttonTextLight,
  },
});

export default CodeInputScreen;
