import React from 'react';
import { Text, View } from 'react-native';

import styles from '../DR/Header/style';

export default function BulletItem({ text }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        marginLeft: 15,
      }}>
      <Text style={{ fontSize: 25, margin: 0 }}>{'\u2022' + ' '}</Text>
      <View style={{ justifyContent: 'center' }}>
        <Text style={styles.text}>{text}</Text>
      </View>
    </View>
  );
}
