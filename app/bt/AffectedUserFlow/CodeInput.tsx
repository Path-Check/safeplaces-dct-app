import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import {
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

  const isIOS = Platform.OS === 'ios';

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

  const handleOnPressCancel = () => {
    navigation.navigate(Screens.Settings);
  };

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
                  maxLength={length}
                  style={styles.codeInput}
                  keyboardType={'number-pad'}
                  returnKeyType={'done'}
                  onChangeText={handleOnChangeText}
                  blurOnSubmit={false}
                  onSubmitEditing={Keyboard.dismiss}
                />
              </View>

              <Typography style={styles.errorSubtitle} use='body2'>
                {codeInvalid ? t('export.code_input_error') : ' '}
              </Typography>
            </View>

            <View>
              <Button
                loading={isCheckingCode}
                label={t('export.code_input_button_submit')}
                onPress={handleOnPressNext}
                style={styles.button}
                textStyle={styles.buttonText}
              />
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
    color: Colors.errorText,
  },
  codeInput: {
    ...Forms.textInput,
  },
  button: {
    ...Buttons.primary,
  },
  buttonText: {
    ...TypographyStyles.buttonTextPrimary,
  },
  secondaryButton: {
    ...Buttons.secondary,
  },
  secondaryButtonText: {
    ...TypographyStyles.buttonTextSecondary,
  },
});

export default CodeInputScreen;
