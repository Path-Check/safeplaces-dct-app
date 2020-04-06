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
              style={[styles.touchableTrigger, styles.touchableText]}
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
            onPress={() => {
              this.setState({ modalVisible: true });
            }}
            style={styles.touchableTrigger}>
            <Text style={styles.touchableText}>{selectedLabel}</Text>
          </TouchableOpacity>
          <Modal
            animationType='slide'
            transparent
            visible={this.state.modalVisible}>
            <View style={{ flex: 2 }}>
              <TouchableWithoutFeedback
                style={{ flex: 1, backgroundColor: '#000000', opacity: 0.4 }}
                onPress={() => this.setState({ modalVisible: false })}>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: '#000000',
                    opacity: 0.2,
                  }}></View>
              </TouchableWithoutFeedback>
            </View>
            <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
              <TouchableWithoutFeedback
                onPress={() => this.setState({ modalVisible: false })}>
                <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>
                    <Text
                      style={{
                        color: '#007aff',
                        fontWeight: 'bold',
                        textAlign: 'right',
                        marginTop: 16,
                        marginRight: 22,
                      }}
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
            </View>
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
  touchableTrigger: {
    backgroundColor: '#ffffff',
    opacity: 0.4,
    paddingVertical: 4,
    paddingHorizontal: 11,
    borderRadius: 100,
  },
  touchableText: {
    fontSize: 12,
    color: '#4051DB',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
});
