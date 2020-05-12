import React from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';

const SPKeyboardAvoidingView = ({ behavior, children }) => {
  const isiOS = Platform.OS === 'ios';

  const instanceBehavior =
    behavior === 'height' || behavior === 'position' || behavior === 'padding'
      ? behavior
      : null;

  return (
    <KeyboardAvoidingView
      accessible={false}
      style={styles.keyboardView}
      autoScrollToFocusedInput
      behavior={isiOS ? instanceBehavior : 'height'}>
      {children}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
});

export default SPKeyboardAvoidingView;
