import React, { Component } from 'react';
import { StyleSheet } from 'react-native';

import { Button } from '../../../components/Button';
import languages from '../../../locales/languages';

class NextSteps extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let buttonLabel;
    let buttonFunction;
    buttonLabel = languages.t('label.exposure_next_steps');
    buttonFunction = () => {
      this.props.navigation.navigate('ExposedResponse');
    };
    return (
      <Button
        label={buttonLabel}
        onPress={() => buttonFunction()}
        style={styles.buttonContainer}
        secondary
      />
    );
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 24,
    height: 54, // fixes overlaying buttons on really small screens
  },
});

export default NextSteps;
