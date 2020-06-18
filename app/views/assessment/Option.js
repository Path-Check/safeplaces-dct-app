import DateTimePicker from '@react-native-community/datetimepicker';
import React, { Fragment, useEffect, useMemo, useState } from 'react';

import { Option as SharedOption } from '../../components/Option';
import { isPlatformAndroid, isPlatformiOS } from '../../Util';
import {
  SCREEN_TYPE_CHECKBOX,
  SCREEN_TYPE_DATE,
  SCREEN_TYPE_RADIO,
} from './constants';

/**
 * @typedef { import(".").SurveyAnswers } SurveyAnswers
 * @typedef { import(".").SurveyOption["values"][0] } SurveyOptionValue
 */

/** @type {React.FunctionComponent<{
 *   answer?: SurveyAnswers[0][0];
 *   index: number;
 *   onSelect: (value: string) => void;
 *   option: SurveyOptionValue;
 *   selected: boolean;
 *   type: Extract<SurveyScreen, 'Checkbox' | 'Date' | 'Radio'>
 * }>} */
export const Option = ({
  answer,
  index,
  onSelect,
  option,
  isSelected,
  type,
}) => {
  // The API doesn't have a defined way to know a specific option is a date,
  // we just assume the first option is the date picker when type is SCREEN_TYPE_DATE
  const isDateOption = type === SCREEN_TYPE_DATE && index === 0;
  const typeArray = [SCREEN_TYPE_CHECKBOX, SCREEN_TYPE_RADIO, SCREEN_TYPE_DATE];
  const isValidType = typeArray.includes(type);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [date, setDate] = useState(() =>
    isDateOption && isSelected && answer ? new Date(answer.value) : null,
  );
  const label = useMemo(() => {
    if (isDateOption && date) {
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    }
    return option.label;
  }, [date, isDateOption, option]);

  useEffect(() => {
    if (isDateOption && !isSelected) {
      setDate(null);
      setShowDatePicker(false);
    }
  }, [isDateOption, isSelected]);

  const handleOnPress = () => {
    if (isDateOption) {
      let date = new Date();
      setDate(date);
      setShowDatePicker(true);
      if (isPlatformiOS()) onSelect(date.toDateString());
      return;
    }
    onSelect(option.value);
  };

  const handleDateTimePickerSelect = (e, date) => {
    if (date) {
      if (isPlatformAndroid()) setShowDatePicker(false);
      onSelect(date.toDateString());
      setDate(date);
    }
  };

  return (
    <Fragment>
      <SharedOption
        onPress={handleOnPress}
        testID='option'
        isValidType={isValidType}
        isSelected={isSelected}
        inputType={type}
        title={label}
        description={option.description}
      />
      {showDatePicker && (
        <DateTimePicker
          display='default'
          is24Hour
          mode='date'
          onChange={handleDateTimePickerSelect}
          timeZoneOffsetInMinutes={0}
          testID='datepicker'
          value={date}
        />
      )}
    </Fragment>
  );
};
