import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Picker,
  Modal,
  Platform,
  StyleSheet,
} from 'react-native';

// Code for the language select dropdown, for nice native handling on both iOS and Android.
export default class NativePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
    };
  }

  render() {
    // iOS and Android Pickers behave differently, handled below
    if (Platform.OS === 'android') {
      const selectedItem = this.props.items.find(
        i => i.value === this.props.value,
      );
      const selectedLabel = selectedItem ? selectedItem.label : '';

      return (
        <View style={styles.inputContainer}>
          <TouchableOpacity
            onPress={() => this.setState({ modalVisible: true })}>
            <TextInput
              style={styles.input}
              editable={false}
              placeholder='Select language'
              onChangeText={searchString => {
                this.setState({ searchString });
              }}
              value={selectedLabel}
            />
          </TouchableOpacity>
          <Picker
            selectedValue={this.props.value}
            onValueChange={this.props.onValueChange}
            style={{ opacity: 0, marginTop: -45 }}>
            {this.props.items.map((i, index) => (
              <Picker.Item key={index} label={i.label} value={i.value} />
            ))}
          </Picker>
        </View>
      );
    } else {
      const selectedItem = this.props.items.find(
        i => i.value === this.props.value,
      );
      const selectedLabel = selectedItem ? selectedItem.label : '';

      return (
        <View style={styles.inputContainer}>
          <TouchableOpacity
            onPress={() => this.setState({ modalVisible: true })}>
            <TextInput
              style={styles.input}
              editable={false}
              placeholder='Select language'
              onChangeText={searchString => {
                this.setState({ searchString });
              }}
              value={selectedLabel}
            />
          </TouchableOpacity>
          <Modal
            animationType='slide'
            transparent
            visible={this.state.modalVisible}>
            <TouchableWithoutFeedback
              onPress={() => this.setState({ modalVisible: false })}>
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text
                    style={{ color: 'blue' }}
                    onPress={() => this.setState({ modalVisible: false })}>
                    Done
                  </Text>
                </View>
                <View
                  onStartShouldSetResponder={evt => true}
                  onResponderReject={evt => {}}>
                  <Picker
                    selectedValue={this.props.value}
                    onValueChange={this.props.onValueChange}>
                    {this.props.items.map((i, index) => (
                      <Picker.Item
                        key={index}
                        label={i.label}
                        value={i.value}
                      />
                    ))}
                  </Picker>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: '3%',
  },
  descriptionContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  descriptionIconContainer: {
    alignSelf: 'center',
  },
  descriptionIcon: {
    width: 10,
    height: 10,
    resizeMode: 'contain',
  },
  descriptionTextContainer: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: '5%',
  },
  input: {
    backgroundColor: '#ffffff',
    opacity: 0.4,
    textAlign: 'center',
    paddingVertical: 3,
    paddingHorizontal: 9,
    borderRadius: 100,
    color: '#4051DB',
    textTransform: 'uppercase',
    fontSize: 12,
  },
});
