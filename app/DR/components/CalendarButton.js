import React from 'react';
import { View } from 'react-native';
import { Button, Text } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import styles from './styles';

export default function CalendarButton({ onPress, text }) {
  return (
    <View>
      <Button iconRight style={styles.calendarButton} onPress={onPress}>
        <Text style={{ color: '#6B6B6B' }}>{text}</Text>
        <Icon
          name="calendar-o"
          size={wp('5%')}
          color="#6B6B6B"
          style={{ marginRight: 10 }}
        />
      </Button>
    </View>
  );
}
