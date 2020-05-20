import React from 'react';
import { View } from 'react-native';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

export default function CalendarButton({ onChange, date, minDate = '' }) {
  return (
    <View>
      <DatePicker
        mode="date"
        style={{ width: wp('75%') }}
        date={date}
        format={'DD-MM-YYYY'}
        minDate={minDate}
        maxDate={moment(new Date(), 'YYYY-MM-DD').format('DD-MM-YYYY')}
        onDateChange={date => onChange(date)}
        showIcon={true}
        iconComponent={
          <Icon
            name="calendar-o"
            size={wp('5%')}
            color="#6B6B6B"
            style={{ marginRight: 10 }}
          />
        }
        confirmBtnText={'Aceptar'}
        cancelBtnText={'Cancelar'}
        style={{ width: wp('40%'), backgroundColor: '#EFF4F9' }}
        customStyles={{
          dateInput: {
            borderWidth: 0,
            alignItems: 'center'
          },
          dateText: { color: '#6B6B6B', fontSize: 16 }
        }}
      />
    </View>
  );
}
