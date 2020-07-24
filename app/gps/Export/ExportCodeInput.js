import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  KeyboardAvoidingView,
  StatusBar,
  StyleSheet,
  TextInput,
  View,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '../../components/Button';
import { IconButton } from '../../components/IconButton';
import { Typography } from '../../components/Typography';
import exitWarningAlert from './exitWarningAlert';
import exportCodeApi from '../../api/export/exportCodeApi';
import { Screens } from '../../navigation';

import { Icons } from '../../assets';
import { Colors } from '../../styles';
import { FeatureFlagOption } from '../../store/types';
import { useSelector } from 'react-redux';

const CODE_LENGTH = 6;

const CodeInput = ({ code, length, setCode }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  let characters = [];
  for (let i = 0; i < length; i++) characters.push(code[i]);

  const characterRefs = useRef([]);
  useEffect(() => {
    characterRefs.current = characterRefs.current.slice(0, length);
  }, [length]);

  const focus = (i) => {
    characterRefs.current[i].focus();
  };

  // Focus on mount
  useEffect(() => {
    setTimeout(() => {
      focus(0);
    }, 0); // allow waiting for transition to end & first paint
  }, []);

  const onFocus = (i) => {
    if (i > currentIndex) {
      // prohibit skipping forward
      focus(currentIndex);
    } else {
      // restart at clicked character
      setCurrentIndex(i);
      setCode(code.slice(0, i));
    }
  };

  // Adding characters
  const onChangeCharacter = (d) => {
    if (d.length) {
      setCode(code.slice(0, currentIndex) + d);
      const nextIndex = currentIndex + 1;
      if (nextIndex < length) {
        setCurrentIndex(nextIndex);
        focus(nextIndex);
      }
    }
  };

  // Removing characters
  const onKeyPress = (e) => {
    if (e.nativeEvent.key === 'Backspace') {
      // go to previous
      if (!code[currentIndex]) {
        const newIndex = currentIndex - 1;
        if (newIndex >= 0) {
          setCurrentIndex(newIndex);
          setCode(code.slice(0, newIndex));
          focus(newIndex);
        }
      }
      // clear current (used for last character)
      else {
        setCode(code.slice(0, currentIndex));
      }
    }
  };

  return (
    <View style={{ flexDirection: 'row', flexShrink: 1 }}>
      {characters.map((character, i) => (
        <TextInput
          ref={(ref) => (characterRefs.current[i] = ref)}
          key={`${i}CodeCharacter`}
          value={character}
          style={[
            styles.characterInput,
            {
              borderColor: character
                ? Colors.primaryBorder
                : Colors.quaternaryViolet,
            },
          ]}
          maxLength={1}
          keyboardType={'number-pad'}
          returnKeyType={'done'}
          onChangeText={onChangeCharacter}
          onKeyPress={onKeyPress}
          onFocus={() => onFocus(i)}
        />
      ))}
    </View>
  );
};

export const ExportSelectHA = ({ route, navigation }) => {
  const { t } = useTranslation();

  const [code, setCode] = useState('');
  const [isCheckingCode, setIsCheckingCode] = useState(false);
  const [codeInvalid, setCodeInvalid] = useState(false);

  const featureFlags = useSelector((state) => state.featureFlags?.flags || {});
  const bypassApi = !!featureFlags[FeatureFlagOption.BYPASS_EXPORT_API];

  const { selectedAuthority } = route.params;

  const navigateToNextScreen = () => {
    navigation.navigate(Screens.ExportLocationConsent, {
      selectedAuthority,
      code,
    });
  };

  const validateCode = async () => {
    if (bypassApi) {
      navigateToNextScreen();
      return;
    }
    setIsCheckingCode(true);
    setCodeInvalid(false);
    try {
      const { valid } = await exportCodeApi(selectedAuthority, code);

      if (valid) {
        navigateToNextScreen();
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
    <View style={{ flex: 1 }}>
      <StatusBar
        barStyle='dark-content'
        backgroundColor={Colors.primaryBackgroundFaintShade}
        translucent={false}
      />
      <SafeAreaView style={styles.wrapper}>
        <KeyboardAvoidingView behavior={'padding'} style={styles.container}>
          <View style={styles.headerIcons}>
            <IconButton
              icon={Icons.BackArrow}
              size={27}
              color={Colors.primaryViolet}
              onPress={() => navigation.goBack()}
            />
            <IconButton
              icon={Icons.Close}
              size={22}
              color={Colors.primaryViolet}
              onPress={() => exitWarningAlert(navigation, Screens.ExportStart)}
            />
          </View>
          <View style={{ flex: 1, marginBottom: 20 }}>
            <Typography use='headline2'>
              {t('export.code_input_title')}
            </Typography>
            <View style={{ height: 8 }} />
            <Typography use='body1'>
              {t('export.code_input_body', {
                name: selectedAuthority.name,
              })}
            </Typography>
            {/* These flex grows allow for a lot of flexibility across device sizes */}
            <View style={{ maxHeight: 60, flexGrow: 1 }} />
            {/* there's a flex end bug on android, this is a hack to ensure some spacing */}
            <View
              style={{
                flexGrow: 1,
                marginVertical: Platform.OS === 'ios' ? 0 : 10,
              }}>
              <CodeInput code={code} length={CODE_LENGTH} setCode={setCode} />
              {codeInvalid && (
                <Typography style={styles.errorSubtitle} use='body2'>
                  {t('export.code_input_error')}
                </Typography>
              )}
            </View>
            <Button
              invert
              disabled={code.length < CODE_LENGTH}
              loading={isCheckingCode}
              label={t('common.next')}
              onPress={validateCode}
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  errorSubtitle: {
    marginTop: 8,
    color: Colors.errorText,
  },
  headerIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    paddingLeft: 0,
  },
  wrapper: {
    flex: 1,
    paddingBottom: 44,
    backgroundColor: Colors.primaryBackgroundFaintShade,
  },
  container: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    flex: 1,
  },
  characterInput: {
    fontSize: 20,
    color: Colors.violetTextDark,
    textAlign: 'center',
    flexGrow: 1,
    aspectRatio: 1,
    borderWidth: 2,
    borderRadius: 10,
    marginRight: 6,
  },
});

export default ExportSelectHA;
