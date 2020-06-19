import * as React from 'react';
import { Image, ImageSourcePropType, Modal, ScrollView, StyleSheet, Text,
         TouchableHighlight, TouchableOpacity, View } from 'react-native';

import { PlantImages } from '../../constants/Plants';
import { IPlantItem } from '../Business/PlantBackend';
import { IOwnedItem } from '../Business/StoreBackend';

interface IProps {
  plantName: string;
  data: IOwnedItem[];
  swapPlant: (plant: IOwnedItem) => void;
}

interface IState {
  modalVisible: boolean;
}

class PlantCards extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    this.state = {
      modalVisible: false,
    };
  }

  public setModalVisible = (visible: boolean) => {
    this.setState({ modalVisible: visible });
  }

  public render() {
    const { modalVisible } = this.state;

    const dataArr = this.props.data.map((item, i) => {

      const itemImage: ImageSourcePropType = PlantImages[item.name];

      return (
        <View key={i}>
          <View
            style={{
              backgroundColor: 'white',
              width: 100,
            }}
          >
            <TouchableOpacity
            style={styles.openButton}
            onPress={() => {
              this.props.swapPlant(item);
            }}
          >
            <Image
                source={itemImage}
                style={styles.plantStyle}
            />
          </TouchableOpacity>
          <Text>Available: {item.owned - item.used}</Text>
          </View>
        </View>
      );
    });

    return (
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text>{this.props.plantName}</Text>
              <ScrollView
                  horizontal
                  contentContainerStyle={{
                    alignItems: 'flex-end',
                  }}
                >
                  {
                    dataArr // Render the JSX in a ScrollView
                  }
                </ScrollView>
              <TouchableHighlight
                  style={{ ...styles.closeButton, backgroundColor: '#2196F3' }}
                  onPress={() => {
                    this.setModalVisible(!modalVisible);
                  }}
                >
                  <Text style={styles.textStyle}>Close</Text>
                </TouchableHighlight>

              </View>
            </View>
        </Modal>

        <TouchableOpacity
            style={styles.openButton}
            onPress={() => {
              this.setModalVisible(true);
            }}
          >
            <Image
                source={PlantImages[this.props.plantName]}
                style={styles.plantStyle}
            />
          </TouchableOpacity>

      </View>

    );
  }

}

export default PlantCards;

const styles = StyleSheet.create({
  centeredView: {
      // flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
      // marginTop: 20,
  },
  modalView: {
    margin: 0,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: 350,
    height: 350,
  },
  openButton: {
      // backgroundColor: "#F194FF",
    borderRadius: 20,
      // padding: 10,
    elevation: 2,
  },
  closeButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  plantStyle: {
    width: 100,
    height: 100,
  },
});
