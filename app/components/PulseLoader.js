import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Image, TouchableOpacity, Animated, Easing } from 'react-native';
import Pulse from './Pulse';


export default class LocationPulseLoader extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            circles: []
        };

        this.counter = 1;
        this.setInterval = null;
        this.anim = new Animated.Value(1);
    }

    componentDidMount() {
        this.setCircleInterval();
    }

    setCircleInterval() {
        this.setInterval = setInterval(this.addCircle.bind(this), this.props.interval);
        this.addCircle();
    }

    addCircle() {
        this.setState({ circles: [...this.state.circles, this.counter] });
        this.counter++;
    }

    onPressIn() {
        Animated.timing(this.anim, {
            toValue: this.props.pressInValue,
            duration: this.props.pressDuration,
            easing: this.props.pressInEasing,
        }).start(() => clearInterval(this.setInterval));
    }

    onPressOut() {
        Animated.timing(this.anim, {
            toValue: 1,
            duration: this.props.pressDuration,
            easing: this.props.pressOutEasing,
        }).start(this.setCircleInterval.bind(this));
    }

    getIcon(size, avatar, avatarBackgroundColor, avatarProvider) {
        if(avatarProvider) {
            return avatarProvider(size);
        } else {
        return <Image
            source={{ uri: avatar }}
            style={{
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor: avatarBackgroundColor
            }}
        />;
        }
    }

    render() {
        const { size, avatar, avatarBackgroundColor, interval, avatarProvider } = this.props;

        return (
            <View style={{
                flex: 1,
                backgroundColor: 'transparent',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                {this.state.circles.map((circle) => (
                    <Pulse
                        key={circle}
                        {...this.props}
                    />
                ))}

                <TouchableOpacity
                    activeOpacity={1}
                    onPressIn={this.onPressIn.bind(this)}
                    onPressOut={this.onPressOut.bind(this)}
                    style={{
                        transform: [{
                            scale: this.anim
                        }]
                    }}
                >
                    {this.getIcon(size, avatar, avatarBackgroundColor, avatarProvider)}
                </TouchableOpacity>
            </View>
        );
    }
}

LocationPulseLoader.propTypes = {
    interval: PropTypes.number,
    size: PropTypes.number,
    pulseMaxSize: PropTypes.number,
    avatarProvider: PropTypes.func,
    avatar: PropTypes.string.isRequired,
    avatarBackgroundColor: PropTypes.string,
    pressInValue: PropTypes.number,
    pressDuration: PropTypes.number,
    borderColor: PropTypes.string,
    backgroundColor: PropTypes.string,
    getStyle: PropTypes.func,
};

LocationPulseLoader.defaultProps = {
    interval: 2000,
    size: 100,
    pulseMaxSize: 250,
    avatarProvider: undefined,
    avatar: undefined,
    avatarBackgroundColor: 'white',
    pressInValue: 0.8,
    pressDuration: 150,
    pressInEasing: Easing.in,
    pressOutEasing: Easing.in,
    borderColor: '#D8335B',
    backgroundColor: '#ED225B55',
    getStyle: undefined,
};
