import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import {
  Alert,
  Animated,
  Dimensions,
  Easing,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export class BottomUpPanel extends Component {
  static defaultProps = {
    isOpen: false,
  };

  // Define state
  state = {
    open: false,
    spinValue: new Animated.Value(0),
  };

  config = {
    position: {
      max: height,
      start: height - this.props.startHeight,
      end: this.props.topEnd,
      min: this.props.topEnd,
      animates: [() => this.animatedHeight],
    },
    width: {
      end: width,
      start: width,
    },
    height: {
      end: height,
      start: this.props.startHeight,
    },
  };

  animatedHeight = new Animated.Value(
    this.props.isOpen ? this.config.height.end : this.config.height.start,
  );

  animatedPosition = new Animated.Value(
    this.props.isOpen ? this.config.position.end : this.config.position.start,
  );

  UNSAFE_componentWillMount() {
    this.animatedPosition.addListener(value => {
      // Every time that position changes then actualize the related properties. I.e: height, so the view
      // has the interpolated height
      this.config.position.animates.map(item => {
        item().setValue(value.value);
      });
    });
    // Reset value once listener is registered to update depending animations
    // eslint-disable-next-line no-underscore-dangle
    this.animatedPosition.setValue(this.animatedPosition._value);
  }

  // Handle isOpen prop changes to either open or close the window
  UNSAFE_componentWillReceiveProps(nextProps) {
    // isOpen prop changed to true from false
    if (!this.props.isOpen && nextProps.isOpen) {
      this.open();
    }
    // isOpen prop changed to false from true
    else if (this.props.isOpen && !nextProps.isOpen) {
      this.close();
    }
  }

  render() {
    const { content } = this.props;

    // Height according to position
    const animatedHeight = this.animatedHeight.interpolate({
      inputRange: [this.config.position.end, this.config.position.start],
      outputRange: [this.config.height.end, this.config.height.start],
    });

    // Icon rotation
    const spin = this.state.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '180deg'],
    });
    return (
      <Animated.View
        style={[styles.buttonUpPanelView, { height: animatedHeight }]}>
        <Animated.View
          style={[
            styles.content,
            {
              // Add padding at the bottom to fit all content on the screen
              paddingBottom: this.props.topEnd,
              width,
              // Animate position on the screen
              transform: [
                { translateY: this.animatedPosition },
                { translateX: 0 },
              ],
            },
          ]}>
          {/* Section for header or button to open the panel */}
          <TouchableWithoutFeedback
            onPress={() => {
              this.toggle();
            }}>
            <Animated.View style={{ height: this.props.startHeight }}>
              <View
                style={[
                  this.props.bottomUpSlideBtn,
                  { width, height: this.props.startHeight },
                ]}>
                {this.props.headerText}
                <Animated.View style={{ transform: [{ rotate: spin }] }}>
                  {this.props.icon()}
                </Animated.View>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>

          {/* Scrollable content */}
          <ScrollView
            ref={scrollView => {
              this.scrollView = scrollView;
            }}
            // Enable scrolling only when the window is open
            scrollEnabled={this.state.open}
            // Hide all scrolling indicators
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            // Trigger onScroll often
            scrollEventThrottle={16}
            onScroll={this.handleScroll}>
            {/* Render content components */}
            {content()}
          </ScrollView>
        </Animated.View>
      </Animated.View>
    );
  }

  open = () => {
    this.setState({ open: true }, () => {
      Animated.timing(this.animatedPosition, {
        toValue: this.config.position.end,
        duration: 600,
        useNativeDriver: true,
      }).start();
      Animated.timing(this.state.spinValue, {
        toValue: 1,
        duration: 600,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start();
    });
  };

  close = () => {
    this.scrollView.scrollTo({ y: 0 });
    Animated.timing(this.animatedPosition, {
      toValue: this.config.position.start,
      duration: 600,
      useNativeDriver: true,
    }).start(() =>
      this.setState({
        open: false,
      }),
    );
    Animated.timing(this.state.spinValue, {
      toValue: 0,
      duration: 600,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  };

  toggle = () => {
    const { sortedMarkers, t } = this.props;
    if (sortedMarkers.length === 0) {
      Alert.alert(t('maps.error_header'), t('maps.error_message'));
    } else if (!this.state.open) {
      this.open();
    } else {
      this.close();
    }
  };
}

export default withTranslation()(BottomUpPanel);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
  },
  content: {
    backgroundColor: 'transparent',
    height,
  },
  buttonUpPanelView: {
    position: 'absolute',
    bottom: 0,
    width,
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
  },
});
