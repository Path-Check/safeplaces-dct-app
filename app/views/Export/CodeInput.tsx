import React, { useState, MutableRefObject, useRef, useEffect } from 'react';
import {
  TextInput,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  View,
  StyleSheet,
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

export const CodeInput = ({
  code,
  length,
  setCode,
}: {
  code: string;
  length: number;
  setCode: (code: string) => void;
}): JSX.Element => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const characters: string[] = [];
  for (let i = 0; i < length; i++) characters.push(code[i]);

  const characterRefs: MutableRefObject<TextInput[]> = useRef([]);
  useEffect(() => {
    characterRefs.current = characterRefs.current.slice(0, length);
  }, [length]);

  const focus = (i: number) => {
    characterRefs.current[i].focus();
  };

  // Focus on mount
  useEffect(() => {
    setTimeout(() => {
      focus(0);
    }, 0); // allow waiting for transition to end & first paint
  }, []);

  const onFocus = (i: number) => {
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
  const onChangeCharacter = (d: string) => {
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
  const onKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
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
          ref={(ref) => {
            if (ref != null) {
              characterRefs.current[i] = ref;
            }
          }}
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
          keyboardType={'number-pad'}
          returnKeyType={'done'}
          onChangeText={onChangeCharacter}
          onKeyPress={onKeyPress}
          blurOnSubmit={false}
          onFocus={() => onFocus(i)}
          testID={`input${i}`}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
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

export default CodeInput;
