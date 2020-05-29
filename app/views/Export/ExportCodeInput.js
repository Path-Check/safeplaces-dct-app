// TODO: REMOVE
/* eslint-disable react-native/no-raw-text */
import React, { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  StatusBar,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icons } from '../../assets';
import { Button } from '../../components/Button';
import { IconButton } from '../../components/IconButton';
import { Typography } from '../../components/Typography';
import Colors from '../../constants/colors';
import fontFamily from '../../constants/fonts';
import { Theme } from '../../constants/themes';

const CODE_LENGTH = 6;

const CodeInput = ({ code, length, setCode }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  let digits = [];
  for (let i = 0; i < length; i++) digits.push(code[i]);

  const digitRefs = useRef([]);
  useEffect(() => {
    digitRefs.current = digitRefs.current.slice(0, length);
  }, [length]);

  const focus = i => {
    digitRefs.current[i].focus();
  };

  // Focus on mount
  useEffect(() => {
    setTimeout(() => {
      focus(0);
    }, 0); // allow waiting for transition to end & first paint
  }, []);

  const onFocus = i => {
    if (i > currentIndex) {
      // prohibit skipping forward
      focus(currentIndex);
    } else {
      // restart at clicked digit
      setCurrentIndex(i);
      setCode(code.slice(0, i));
    }
  };

  // Adding digits
  const onChangeDigit = d => {
    if (d.length) {
      setCode(code.slice(0, currentIndex) + d);
      const nextIndex = currentIndex + 1;
      if (nextIndex < length) {
        setCurrentIndex(nextIndex);
        focus(nextIndex);
      }
    }
  };

  // Removing digits
  const onKeyPress = e => {
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
      // clear current (used for last digitf)
      else {
        setCode(code.slice(0, currentIndex));
      }
    }
  };

  return (
    <View style={{ flexDirection: 'row', flex: 1 }}>
      {[...digits].map((digit, i) => (
        <TextInput
          ref={ref => (digitRefs.current[i] = ref)}
          key={`${i}CodeDigit`}
          value={digit}
          style={{
            fontSize: 20,
            color: '#1F2C9B',
            textAlign: 'center',
            flexShrink: 1,
            aspectRatio: 1,
            borderWidth: 2,
            borderColor: digit ? Colors.VIOLET_BUTTON : '#E5E7FA',
            borderRadius: 10,
            marginRight: 6,
          }}
          keyboardType={'number-pad'}
          returnKeyType={'done'}
          onChangeText={onChangeDigit}
          onKeyPress={onKeyPress}
          blurOnSubmit={false}
          onFocus={() => onFocus(i)}
        />
      ))}
    </View>
  );
};

export const ExportSelectHA = ({ route, navigation }) => {
  const [code, setCode] = useState('');
  const { selectedAuthority } = route.params;

  console.log({ code });

  return (
    <Theme use='default'>
      <StatusBar
        barStyle='dark-content'
        backgroundColor={Colors.VIOLET_BUTTON}
        translucent={false}
      />
      <SafeAreaView
        style={{ flex: 1, paddingBottom: 44, backgroundColor: '#F8F8FF' }}>
        <KeyboardAvoidingView
          behavior={'padding'}
          style={{ paddingHorizontal: 24, paddingBottom: 20, flex: 1 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 12,
              paddingLeft: 0,
            }}>
            <IconButton
              icon={Icons.BackArrow}
              size={27}
              onPress={() => navigation.replace('ExportSelectHA')}
            />
            <IconButton
              icon={Icons.Close}
              size={22}
              onPress={() => navigation.navigate('SettingsScreen')}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Typography use='headline2' style={styles.exportSectionTitles}>
              Enter your verification code
            </Typography>
            <View style={{ height: 8 }} />
            <Typography use='body1'>
              {`The representative from ${selectedAuthority.name} will provide a verfication code over the phone to link your data with ${selectedAuthority.name}.`}
            </Typography>
            <View style={{ height: 60 }} />
            <CodeInput code={code} length={CODE_LENGTH} setCode={setCode} />
            <Button
              style={{ marginBottom: 20 }}
              disabled={code.length < CODE_LENGTH}
              label={'Next'}
              onPress={() => {}}
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Theme>
  );
};

const styles = StyleSheet.create({
  exportSectionTitles: {
    color: '#1F2C9B',
    fontWeight: '500',
    fontFamily: fontFamily.primaryMedium,
  },
});

export default ExportSelectHA;
