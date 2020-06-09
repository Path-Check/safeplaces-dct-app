import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { I18nextProvider } from 'react-i18next';

import i18n from '../../../locales/languages';
import { AnswersContext } from '../Context';
import { Question } from '../Question';
import {
  QUESTION_TYPE_MULTI,
  QUESTION_TYPE_TEXT,
  SCREEN_TYPE_CHECKBOX,
  SCREEN_TYPE_RADIO,
} from '../constants';

test('base', () => {
  const { asJSON } = render(
    <Question
      onChange={jest.fn()}
      onNext={jest.fn()}
      option={option}
      question={question}
    />,
    { wrapper: Wrapper },
  );
  expect(asJSON()).toMatchSnapshot();
});

test('supports line breaks in the description', () => {
  const { queryAllByTestId } = render(
    <Question
      onChange={jest.fn()}
      onNext={jest.fn()}
      option={option}
      question={{ ...question, question_description: 'Hello\nWorld' }}
    />,
    { wrapper: Wrapper },
  );
  expect(queryAllByTestId('description')).toHaveLength(2);
});

test('QUESTION_TYPE_TEXT', () => {
  let onChange = jest.fn();
  const { queryAllByTestId } = render(
    <Question
      onChange={onChange}
      onNext={jest.fn()}
      option={option}
      question={question}
    />,
    { wrapper: Wrapper },
  );
  fireEvent.press(queryAllByTestId('option')[0]);
  expect(onChange).toHaveBeenCalledWith([{ index: 0, value: '0' }]);
  fireEvent.press(queryAllByTestId('option')[1]);
  expect(onChange).toHaveBeenCalledWith([{ index: 1, value: '1' }]);
});

test('QUESTION_TYPE_MULTI', () => {
  let onChange = jest.fn();
  const { queryAllByTestId } = render(
    <Question
      onChange={onChange}
      onNext={jest.fn()}
      option={option}
      question={{
        question_type: QUESTION_TYPE_MULTI,
        screen_type: SCREEN_TYPE_CHECKBOX,
      }}
    />,
    { wrapper: Wrapper },
  );
  fireEvent.press(queryAllByTestId('option')[0]);
  expect(onChange).toHaveBeenCalledWith([{ index: 0, value: '0' }]);
  fireEvent.press(queryAllByTestId('option')[1]);
  expect(onChange).toHaveBeenCalledWith([
    { index: 0, value: '0' },
    { index: 1, value: '1' },
  ]);
  fireEvent.press(queryAllByTestId('option')[0]);
  expect(onChange).toHaveBeenCalledWith([{ index: 1, value: '1' }]);
});

function Wrapper({ children }) {
  return (
    <I18nextProvider i18n={i18n}>
      <AnswersContext.Provider value={{}}>{children}</AnswersContext.Provider>
    </I18nextProvider>
  );
}

const question = {
  option_key: 'option_1',
  question_key: '1',
  question_text: 'What is the answer?',
  question_type: QUESTION_TYPE_TEXT,
  required: false,
  screen_type: SCREEN_TYPE_RADIO,
};

const option = {
  key: 'option_1',
  values: [
    {
      label: 'A',
      value: '0',
    },
    {
      label: 'B',
      value: '1',
    },
  ],
};
