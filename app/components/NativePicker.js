import React, { Component } from 'react';
import {
  Modal,
  Picker,
  Platform,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { Typography } from '../components/Typography';
import languages from '../locales/languages';

/**
 * Native dropdown that abstracts away the UI differences for iOS and Android.
 *
 * Usage:
 *
 *
 * ```jsx
 * <NativePicker
 *     items={[{value: 'x', label: 'X'}]}
 *     value={x}
 *     onValueChange={valueChanged}
 *   >
 *   {({label, openPicker}) => (
 *     <MyLabel onPress={openPicker}>{label}</MyLabel>
 *   )}
 * </NativePicker>
 * ```
 */
export default class NativePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
    };
  }

  render() {
    const renderLabel = this.props.children;
    const openPicker = () => {
      this.setState({ modalVisible: true });
    };
    const selectedItem = this.props.items.find(
      i => i.value === this.props.value,
    );
    const label = selectedItem?.label || '';
    const value = selectedItem?.value;

    // iOS and Android Pickers behave differently, handled below
    if (Platform.OS === 'android') {
      return (
        <View>
          {renderLabel({ value, label, openPicker })}
          <Picker
            selectedValue={this.props.value}
            onValueChange={this.props.onValueChange}
            style={{
              opacity: 0,
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
            }}>
            {this.props.items.map(i => (
              <Picker.Item key={i.value} label={i.label} value={i.value} />
            ))}
          </Picker>
        </View>
      );
    } else {
      return (
        <>
          {renderLabel({ value, label, openPicker })}
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
                  }}
                />
              </TouchableWithoutFeedback>
            </View>
            <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
              <TouchableWithoutFeedback
                onPress={() => this.setState({ modalVisible: false })}>
                <View>
                  <View>
                    <Typography
                      style={{
                        color: '#007aff',
                        fontWeight: 'bold',
                        textAlign: 'right',
                        marginTop: 16,
                        marginRight: 22,
                      }}
                      onPress={() => this.setState({ modalVisible: false })}>
                      {languages.t('Done')}
                    </Typography>
                  </View>
                  <View
                    onStartShouldSetResponder={() => true}
                    onResponderReject={() => {}}>
                    <Picker
                      selectedValue={this.props.value}
                      onValueChange={this.props.onValueChange}>
                      {this.props.items.map(i => (
                        <Picker.Item
                          key={i.value}
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
        </>
      );
    }
  }
}
