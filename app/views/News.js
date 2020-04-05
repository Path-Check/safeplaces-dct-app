import React, { Component } from 'react';
import {
  StyleSheet,
  BackHandler,
  Dimensions,
  ActivityIndicator,
} from 'react-native';

import colors from '../constants/colors';
import { WebView } from 'react-native-webview';
import languages from './../locales/languages';
import fontFamily from '../constants/fonts';
import NavigationBarWrapper from '../components/NavigationBarWrapper';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

class NewsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = { visible: true };
  }

  backToMain() {
    this.props.navigation.goBack();
  }

  handleBackPress = () => {
    this.props.navigation.goBack();
    return true;
  };

  hideSpinner() {
    this.setState({ visible: false });
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  render() {
    return (
      <NavigationBarWrapper
        title={languages.t('label.latest_news')}
        onBackPress={this.backToMain.bind(this)}>
        <WebView
          source={{ uri: 'https://privatekit.mit.edu/views' }}
          onLoad={() => this.hideSpinner()}
        />
        {this.state.visible && (
          <ActivityIndicator
            style={{ position: 'absolute', top: height / 2, left: width / 2 }}
            size='large'
          />
        )}
      </NavigationBarWrapper>
    );
  }
}

const styles = StyleSheet.create({
  // Container covers the entire screen
  container: {
    flex: 1,
    flexDirection: 'column',
    color: colors.PRIMARY_TEXT,
    backgroundColor: colors.WHITE,
  },
  web: {
    flex: 1,
    width: '100%',
    margin: 0,
    padding: 0,
  },
  sectionDescription: {
    fontSize: 16,
    lineHeight: 24,
    textAlignVertical: 'center',
    marginTop: 12,
    fontFamily: fontFamily.primaryRegular,
  },
});

export default NewsScreen;
