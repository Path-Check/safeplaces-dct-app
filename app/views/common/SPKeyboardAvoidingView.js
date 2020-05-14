import React from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';

export const SPKeyboardAvoidingView = ({ behavior, children }) => {
  const isiOS = Platform.OS === 'ios';

  return (
    <KeyboardAvoidingView
      accessible={false}
      style={styles.keyboardView}
      autoScrollToFocusedInput
      behavior={isiOS ? behavior : null}>
      {children}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
});
