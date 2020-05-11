import * as React from 'react';
import {
  View, StyleSheet, Modal,
} from 'react-native';
import {
  Text, Button, Left, CardItem, Right, Badge,
} from 'native-base';
import { Card } from 'react-native-paper';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { FontAwesome5 } from '@expo/vector-icons';
import covidIcon from '../../assets/images/covid19.png';
import AlertList from './components/AlertList';

export default class AlertScreen extends React.Component {
  constructor(props) {
    super(props);

    const alerts = ['Medidas de prevención', 'Medidas de prevención', 'Medidas de prevención'].map((item) => ({
      title: item, subtitle: '3 segundos', text: 'Lavarse las manos es importante, por eso te mostramos las medidas necesarias que usted debe hacer hábito diario', avatarUrl: covidIcon,
    }));
    this.state = {
      alertVisible: false,
      alerts,
    };
  }

  setModalVisible(visible) {
    this.setState({ alertVisible: visible });
  }

  render() {
    const { alertVisible, alerts } = this.state;
    return (
      <View>
        <Card style={styles.bigCards}>
          <CardItem header>
            <Left>
              <FontAwesome5 name="bell" color="#0161F2" size={30} />
              <Text>Alertas</Text>
            </Left>

            <Right style={{ backgroundColor: '#fff' }}>
              <Badge primary>
                <Text>{alerts.length}</Text>
              </Badge>
            </Right>
          </CardItem>
          <CardItem bordered>
            {/* This alert list shows only a preview of the full list */}
            <AlertList alerts={alerts.filter((alert, index) => index < 2)} />
          </CardItem>

          <Button transparent onPress={() => this.setModalVisible(true)}>
            <Text style={styles.fullButtonText}>Ver Todos</Text>
          </Button>

          {/* This modal shows all alerts in full */}
          <Modal
            animationType="slide"
            transparent={false}
            visible={alertVisible}
            onRequestClose={() => {
              this.setModalVisible(false);
            }}
          >
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Left>
                  <Button transparent onPress={() => this.setModalVisible(false)}>
                    <FontAwesome5 name="arrow-left" color="#000" size={20} />
                    <Text style={{ textTransform: 'uppercase', fontSize: 12 }}>
                      Regresar
                    </Text>
                  </Button>
                </Left>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Left>
                  <Text style={styles.modalHeaderText}>Alertas</Text>
                </Left>
              </View>
            </View>
            <View style={styles.alertsContainer}>
              <AlertList alerts={alerts} showMenuPerItem />
            </View>
          </Modal>
        </Card>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  list: {
    padding: 0,
  },
  separator: {
    height: 1,
    backgroundColor: '#ededed',
  },
  alertsContainer: {
    paddingTop: 20,
    paddingRight: 15,
    paddingBottom: 25,
    paddingLeft: 20,
  },
  bigCards: {
    borderRadius: 8,
    // height: wp('30%'),
    justifyContent: 'center',
    marginBottom: hp('2%'),
    padding: wp('5%'),
    width: wp('90%'),
  },
  fullButtonText: {
    textAlign: 'center',
    padding: 10,
    width: '100%',
  },
  modalHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ededed',
  },
  modalHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
