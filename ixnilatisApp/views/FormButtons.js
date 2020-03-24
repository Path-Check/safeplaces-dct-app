import React, {Component } from 'react';
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import I18n from "../../I18n";

const width = Dimensions.get('window').width;

class FormButtons extends Component {
    render() {
      return (<View style={styles.actionButtonsView}>

        <TouchableOpacity onPress={() => this.props.navigation.navigate('FormWorkScreen', {})} style={styles.actionButtonsTouchable}>
          <Text style={styles.actionButtonHead}>{I18n.t("FORM_A")}</Text>
          <Text style={styles.actionButtonText}>{I18n.t("FORMWORK")}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => this.props.navigation.navigate('FormGeneralScreen', {})} style={styles.actionButtonsTouchable}>
          <Text style={styles.actionButtonHead}>{I18n.t("FORM_B")}</Text>
          <Text style={styles.actionButtonText}>{I18n.t("FORMGENERAL")}</Text>
        </TouchableOpacity>
      </View>);
    }
}

const styles = StyleSheet.create({
    actionButtonsView:{
        width:width*.7866,
        flexDirection:'row',
        justifyContent:'space-between',
        marginTop:35
    },
    actionButtonsTouchable:{
        height: 76,
        borderRadius: 8,
        backgroundColor: "#454f63",
        width:width*.35,
        justifyContent:'center',
        alignItems:'center'
    },
    actionButtonImage:{
        height:21.6,
        width:32.2
    },
    actionButtonText:{
        opacity: 0.56,
        fontFamily: "OpenSans-Bold",
        fontSize: 12,
        lineHeight: 17,
        letterSpacing: 0,
        textAlign: "center",
        color: "#ffffff",
        marginTop:3
    },
    actionButtonHead:{
        opacity: 1,
        fontFamily: "OpenSans-Bold",
        fontSize: 14,
        lineHeight: 17,
        letterSpacing: 0,
        textAlign: "center",
        color: "#ffffff",
        marginTop:3
    }
});

export default FormButtons;

