import React, { Component } from 'react';
import {
    View,
    Text,
    Dimensions,
    StyleSheet,
    ImageBackground,
    StatusBar,
} from 'react-native';
const width = Dimensions.get('window').width;
import BackgroundImage from './../../assets/images/launchScreenBackground.png';
import BackgroundOverlayImage from './../../assets/images/launchScreenBackgroundOverlay.png';
import languages from '../../locales/languages';
import ButtonWrapper from '../../components/ButtonWrapper';
import Colors from '../../constants/colors';
import FontWeights from '../../constants/fontWeights';
import IconDenied from './../../assets/svgs/permissionDenied';
import IconGranted from './../../assets/svgs/permissionGranted';
import IconUnknown from './../../assets/svgs/permissionUnknown';

import { SvgXml } from 'react-native-svg';

const PermissionStatusEnum = {
    UNKNOWN: 0,
    GRANTED: 1,
    DENIED: 2
};

const PermissionDescription = ({ title, status, ...props }) => {
    let icon;
    switch(status) {
        case PermissionStatusEnum.UNKNOWN:
            icon = IconUnknown;
            break;
        case PermissionStatusEnum.GRANTED:
            icon = IconGranted;
            break;
        case PermissionStatusEnum.DENIED:
            icon = IconDenied;
            break;
    }
    return (
        <View style={styles.permissionContainer}>
            <Text style={styles.permissionTitle}>
                {title}
            </Text>
            <SvgXml style={styles.permissionIcon} xml={icon} width={30} height={30} />
        </View>
    );
};

class Onboarding extends Component {
    constructor(props) {
        super(props);
        this.state = {
            notificationPermission: PermissionStatusEnum.UNKNOWN,
            locationPermission: PermissionStatusEnum.UNKNOWN,
        };
    }

    render() {
        return (
            <ImageBackground source={BackgroundImage} style={styles.backgroundImage}>
                <ImageBackground source={BackgroundOverlayImage} style={styles.backgroundImage}>
                    <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />

                    <View style={styles.mainContainer}>
                        <View style={styles.contentContainer}>
                            <Text style={styles.headerText}>
                                {languages.t('label.launch_screen5_header')}
                            </Text>
                            <Text style={styles.subheaderText}>
                                {languages.t('label.launch_screen5_subheader')}
                            </Text>
                        </View>
                        <View style={styles.footerContainer}>
                            <View style={styles.divider}></View>
                            <PermissionDescription title={languages.t('label.launch_location_access')} status={this.state.locationPermission} />
                            <View style={styles.divider}></View>
                            <PermissionDescription title={languages.t('label.launch_notification_access')} status={this.state.notificationPermission} />
                            <View style={styles.divider}></View>
                            <View style={styles.spacer}></View>
                            <ButtonWrapper
                                title={languages.t('label.launch_finish_set_up')}
                                onPress={() => {
                                    this.props.navigation.replace('LocationTrackingScreen');
                                    this.props.navigation.navigate('LocationTrackingScreen');
                                }}
                                buttonColor={Colors.VIOLET}
                                bgColor={Colors.WHITE}
                            />
                        </View>
                    </View>
                </ImageBackground>
            </ImageBackground>
        );
    }
};

const styles = StyleSheet.create({
    backgroundImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        flex: 1,
    },
    mainContainer: {
        flex: 1,
        marginTop: 50,
    },
    contentContainer: {
        width: width * 0.9,
        flex: 1,
        justifyContent: 'flex-start',
        alignSelf: 'center',
    },
    headerText: {
        color: Colors.WHITE,
        fontWeight: FontWeights.SEMIBOLD,
        fontSize: 45,
        width: width * 0.6,
    },
    subheaderText: {
        marginTop: '5%',
        color: Colors.WHITE,
        fontWeight: FontWeights.REGULAR,
        fontSize: 15,
        width: width * 0.6,
    },
    divider: {
        backgroundColor: Colors.DIVIDER,
        height: 1,
        marginVertical: 5,
    },
    spacer: {
        marginVertical: '5%',
    },
    footerContainer: {
        position: 'absolute',
        bottom: 0,
        marginBottom: '10%',
        alignSelf: 'center',
    },
    permissionContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    permissionTitle: {
        color: Colors.WHITE,
        fontWeight: FontWeights.REGULAR,
        fontSize: 16,
        alignSelf: 'center',
    },
    permissionIcon: {
        alignSelf: 'center',

    },
});

export default Onboarding;
