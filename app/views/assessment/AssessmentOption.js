import DateTimePicker from '@react-native-community/datetimepicker';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import Icon from '../../assets/svgs/check';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import { isPlatformAndroid, isPlatformiOS } from '../../Util';

/**
 * @typedef { import("./Assessment").SurveyAnswers } SurveyAnswers
 * @typedef { import("./Assessment").SurveyOption["values"][0] } SurveyOptionValue
 */

/** @type {React.FunctionComponent<{
 *   answer?: SurveyAnswers[0][0];
 *   onSelect: (value: string) => void;
 *   option: SurveyOptionValue;
 *   selected: boolean;
 *   type: Extract<SurveyScreen, 'CHECKBOX' | 'RADIO'>
 * }>} */
const AssessmentOption = ({ answer, onSelect, option, selected, type }) => {
  const isDate = option.value === 'DATE';
  const showIndicator = type === 'CHECKBOX' || (type === 'RADIO' && !isDate);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(() =>
    (isDate && selected && answer) ? new Date(answer.value) : null,
  );
  const label = useMemo(() => {
    if (isDate && date)
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    return option.label;
  }, [date, isDate, option]);
  useEffect(() => {
    if (isDate && !selected) {
      setDate(null);
      setShowDatePicker(false);
    }
  }, [isDate, selected]);
  return (
    <Fragment>
      <TouchableOpacity
        onPress={() => {
          if (option.value === 'DATE') {
            let date = new Date();
            setDate(date);
            setShowDatePicker(true);
            if (isPlatformiOS()) onSelect(String(date));
            return;
          }
          onSelect(option.value);
        }}>
        <View style={[styles.container, selected && styles.containerSelected]}>
          <View style={styles.primary}>
            {showIndicator && (
              <View
                style={[
                  styles.indicator,
                  selected && styles.indicatorSelected,
                ]}>
                {selected && type === 'CHECKBOX' && (
                  <SvgXml
                    height={INDICATOR_WIDTH * 0.5}
                    style={styles.indicatorIcon}
                    width={INDICATOR_WIDTH * 0.5}
                    xml={Icon}
                  />
                )}
                {selected && type === 'RADIO' && (
                  <View style={styles.indicatorIconRadio} />
                )}
              </View>
            )}
            <Text style={styles.title}>{label}</Text>
          </View>
          <View style={styles.content}>
            {option.description && (
              <Text style={styles.description}>{option.description}</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          display='default'
          is24Hour
          mode='date'
          onChange={(e, date) => {
            if (date) {
              if (isPlatformAndroid()) setShowDatePicker(false);
              onSelect(String(date));
              setDate(date);
            }
          }}
          timeZoneOffsetInMinutes={0}
          value={date}
        />
      )}
    </Fragment>
  );
};

const INDICATOR_WIDTH = 20;
const INDICATOR_MARGIN = 10;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.WHITE,
    borderColor: Colors.ASSESSMENT_BORDER,
    borderRadius: 8,
    borderWidth: 2,
    marginBottom: 16,
    padding: 10,
  },
  containerSelected: {
    borderColor: Colors.VIOLET,
    elevation: 1,
    shadowColor: Colors.BLACK,
    shadowOffset: { height: 0, width: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  primary: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  indicator: {
    alignItems: 'center',
    borderColor: Colors.ASSESSMENT_BORDER,
    borderRadius: INDICATOR_WIDTH * 2,
    borderWidth: 2,
    height: INDICATOR_WIDTH,
    justifyContent: 'center',
    marginRight: INDICATOR_MARGIN,
    width: INDICATOR_WIDTH,
  },
  indicatorSelected: {
    backgroundColor: Colors.VIOLET,
    borderColor: Colors.VIOLET,
  },
  indicatorIcon: {},
  indicatorIconRadio: {
    borderRadius: 100,
    backgroundColor: Colors.WHITE,
    height: INDICATOR_WIDTH * 0.5,
    width: INDICATOR_WIDTH * 0.5,
  },
  title: {
    fontFamily: Fonts.primarySemiBold,
    fontSize: 20,
  },
  description: {
    fontFamily: Fonts.primaryRegular,
    fontSize: 16,
    marginLeft: INDICATOR_WIDTH + INDICATOR_MARGIN,
  },
});

export default AssessmentOption;
