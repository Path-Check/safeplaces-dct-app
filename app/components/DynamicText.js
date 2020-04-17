// Custome Text handling RTL and LTR text direction

import React, { Component } from 'react';
import { Text , StyleSheet, I18nManager} from 'react-native';


class DynamicText extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Text {...this.props} style={[ styles.defaultTextStyle, this.props.style ]}>
                {this.props.children}
            </Text>
        );
    } 
     
}
const styles = StyleSheet.create({
    defaultTextStyle: {
        writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr'
    }
  });
  

export default DynamicText;
