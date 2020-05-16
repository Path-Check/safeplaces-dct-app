import React from 'react';
import {
  KeyboardAvoidingView as RNKeyboardAvoidingView,
  StyleSheet,
} from 'react-native';

import { isPlatformiOS } from '../../Util';

export const KeyboardAvoidingView = ({ behavior, children }) => {
  return (
    <RNKeyboardAvoidingView
      accessible={false}
      style={styles.keyboardView}
      autoScrollToFocusedInput
      behavior={isPlatformiOS() ? behavior : null}>
      {children}
    </RNKeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
});
