import React, { useEffect, useState, FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import {
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  View,
  Keyboard,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { Button } from '../components/Button';
import reportIssue from '../api/zendesk/reportIssue';

import {
  Spacing,
  Forms,
  Colors,
  Outlines,
  Typography as TypographyStyles,
} from '../styles';
import { Typography } from '../components/Typography';
import { NavigationBarWrapper } from '../components/NavigationBarWrapper';
import { isPlatformiOS } from '../Util';

const ReportIssueForm: FunctionComponent = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [body, setBody] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);

  const validate = () => {
    const hasEmail = email.trim().length > 0;
    const hasBody = body.trim().length > 0;

    if (hasEmail && hasBody) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  };

  useEffect(validate, [email, body]);

  const clearInputs = () => {
    setBody('');
    setEmail('');
    setName('');
  };

  const submitForm = async () => {
    setIsLoading(true);
    try {
      await reportIssue({
        name,
        email,
        body,
      });

      clearInputs();
      setIsLoading(false);
      Alert.alert(t('common.success'), t('report_issue.success'), [
        { onPress: navigation.goBack },
      ]);
    } catch (e) {
      Alert.alert(t('common.something_went_wrong'), t(e.message));
      setIsLoading(false);
    }
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <NavigationBarWrapper
      title={t('screen_titles.report_issue')}
      onBackPress={navigation.goBack}>
      <KeyboardAvoidingView
        behavior={isPlatformiOS() ? 'padding' : undefined}
        keyboardVerticalOffset={-Spacing.tiny}>
        <View style={style.container}>
          <View>
            <Input
              label={t('report_issue.email')}
              editable={!isLoading}
              accessibilityLabel={t('report_issue.email')}
              value={email}
              onChangeText={setEmail}
            />
            <Input
              label={t('report_issue.name')}
              editable={!isLoading}
              accessibilityLabel={t('report_issue.name')}
              value={name}
              onChangeText={setName}
            />
            <Input
              label={t('report_issue.body')}
              editable={!isLoading}
              accessibilityLabel={t('report_issue.body')}
              value={body}
              onChangeText={setBody}
              multiline
            />
          </View>
          <Button
            onPress={submitForm}
            label={t('common.submit')}
            disabled={isDisabled}
            loading={isLoading}
            invert
          />
        </View>
      </KeyboardAvoidingView>
    </NavigationBarWrapper>
  );
};

type InputProps = {
  label: string;
  value: string;
  editable: boolean;
  accessibilityLabel: string;
  multiline?: boolean;
  onChangeText: (newValue: string) => void;
};
const Input = ({
  label,
  value,
  editable,
  accessibilityLabel,
  multiline,
  onChangeText,
}: InputProps) => (
  <View style={style.inputContainer}>
    <Typography style={style.inputLabel}>{label}</Typography>
    <TextInput
      onFocus={() => onChangeText(value.trim())}
      editable={editable}
      accessibilityLabel={accessibilityLabel}
      value={value}
      style={multiline ? style.descriptionInput : style.textInput}
      keyboardType={'default'}
      returnKeyType={'done'}
      onChangeText={onChangeText}
      blurOnSubmit={multiline}
      onSubmitEditing={Keyboard.dismiss}
      multiline={multiline}
    />
  </View>
);

const style = StyleSheet.create({
  container: {
    height: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.medium,
    paddingTop: Spacing.large,
    backgroundColor: Colors.faintGray,
    paddingBottom: Spacing.medium,
  },
  inputContainer: {
    marginTop: Spacing.large,
  },
  inputLabel: {
    ...TypographyStyles.description,
    paddingBottom: Spacing.xxSmall,
  },
  textInput: {
    ...TypographyStyles.primaryTextInput,
    ...Outlines.textInput,
    padding: Spacing.xSmall,
    borderColor: Colors.formInputBorder,
  },
  descriptionInput: {
    ...Forms.textInputFormField,
    ...TypographyStyles.primaryTextInput,
    minHeight: 5 * TypographyStyles.largeLineHeight,
  },
});

export default ReportIssueForm;
