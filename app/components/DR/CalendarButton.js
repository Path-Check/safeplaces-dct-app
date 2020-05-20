import moment from 'moment';
import React from 'react';
import { View } from 'react-native';
import DatePicker from 'react-native-datepicker';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function CalendarButton({ onChange, date, minDate = '' }) {
  return (
    <View>
      <DatePicker
        mode='date'
        style={{ width: wp('40%'), backgroundColor: '#EFF4F9' }}
        date={date}
        format={'DD-MM-YYYY'}
        minDate={minDate}
        maxDate={moment(new Date(), 'YYYY-MM-DD').format('DD-MM-YYYY')}
        onDateChange={date => onChange(date)}
        showIcon
        iconComponent={
          <Icon
            name='calendar-o'
            size={wp('5%')}
            color='#6B6B6B'
            style={{ marginRight: 10 }}
          />
        }
        confirmBtnText={'Aceptar'}
        cancelBtnText={'Cancelar'}
        customStyles={{
          dateInput: {
            borderWidth: 0,
            alignItems: 'center',
          },
          dateText: { color: '#6B6B6B', fontSize: 16 },
        }}
      />
    </View>
  );
}
