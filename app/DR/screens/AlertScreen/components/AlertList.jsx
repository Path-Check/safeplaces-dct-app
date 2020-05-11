import * as React from 'react';
import {
  View, FlatList, StyleSheet,
} from 'react-native';
import AlertRow from './AlertRow';

const styles = StyleSheet.create({
  list: {
    padding: 0,
  },
  separator: {
    height: 1,
    backgroundColor: '#ededed',
  },
});

export default class AlertList extends React.Component {
  constructor(props) {
    super(props);

    const { alerts, showMenuPerItem = false } = props;
    this.state = {
      alerts,
      showMenuPerItem,
    };
  }

  onPress = (item) => item !== null;

  render() {
    const { alerts, showMenuPerItem } = this.state;
    return (
      <View>
        <FlatList
          style={styles.list}
          ItemSeparatorComponent={() => (
            <View style={styles.separator} />
          )}
          data={alerts}
          renderItem={({ item, index }) => (
            <View key={index} style={{ backgroundColor: 'white' }}>
              <AlertRow item={item} showMenuPerItem={showMenuPerItem} />
            </View>
          )}
        />
      </View>
    );
  }
}
