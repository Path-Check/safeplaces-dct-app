import React, { Component } from 'react';
import { StyleSheet } from 'react-native';

import { Button } from '../../../components/Button';

class NextSteps extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let buttonLabel;
    let buttonFunction;
    //buttonLabel = languages.t('label.see_exposure_history');
    buttonLabel = 'Pasos a seguir';
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
    //marginBottom: 24,
    height: 54, // fixes overlaying buttons on really small screens
  },
});

export default NextSteps;
