// Custome Text handling RTL and LTR text direction

import React, { Component } from 'react';
import { TextInput , StyleSheet, I18nManager} from 'react-native';


class DynamicTextInput extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <TextInput {...this.props} style={[ styles.defaultTextInputStyle, this.props.style ]}>
                {this.props.children}
            </TextInput>
        );
    } 
     
}
const styles = StyleSheet.create({
    defaultTextInputStyle: {
        writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr'
    }
  });
  

export default DynamicTextInput;
