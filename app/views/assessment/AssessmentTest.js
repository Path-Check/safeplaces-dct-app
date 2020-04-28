import React from 'react';
import { Button, StatusBar, StyleSheet, View } from 'react-native';

const Assessment = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor='black'
        barStyle='light-content'
        translucent={false}
      />
      <Button
        onPress={() => {
          navigation.navigate('AssessmentScreen');
        }}
        title='Go'
      />
    </View>
  );
};

const styles = StyleSheet.create({
  // eslint-disable-next-line
  container: {
    flex: 1,
  },
});

export default Assessment;
