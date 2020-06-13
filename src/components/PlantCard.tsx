import * as React from 'react';
import { Modal, StyleSheet, Text, TouchableHighlight, View, ScrollView, Image, TouchableOpacity, ImageSourcePropType } from "react-native";

<<<<<<< HEAD
import { IPlantItem, PlantBodies, PlantFooters, PlantHeaders,
  PlantImages } from '../../constants/Plants';
import PlantBackend, { IPlantItem } from '../Business/PlantBackend';
=======
import { IPlantItem,
  PlantBodies, PlantFooters, PlantHeaders,
  PlantImages } from '../../constants/Plants';
>>>>>>> 80d2d05bb1185400e3753797c99d170d31885a3b

interface IProps {
  modalTitle: string;
  transparent: boolean;
  animationType?: string;
  exit?: string;
  data: any;
  swapPlant: (plant: IPlantItem) => void;
}
  
interface IState {
  modalVisible: boolean;
}

class PlantCards extends React.Component<IProps, IState> {
  
  public static defaultProps = {
    animationType: "slide",
    exit: "Close",
  };

  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
    }
  }

  public setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }

  render() {  
    const { modalVisible } = this.state;

    const dataArr = this.props.data.map((item, i, arr) => {

      let itemImage: ImageSourcePropType = PlantImages[item.name];

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
              this.props.swapPlant(item)
            }}
          >
            <Image
                source={itemImage}
                style={styles.plantStyle}
            />
          </TouchableOpacity>
          </View>
        </View>
      )
    });

    return (
      <View style={styles.centeredView}>
        <Modal
          animationType={this.props.animationType}
          transparent={this.props.transparent}
          visible={this.state.modalVisible}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text>{this.props.modalTitle}</Text>
              <ScrollView
                  horizontal
                  contentContainerStyle={{
                    alignItems: 'flex-end',
                  }}
                >
                  {
                    dataArr //Render the JSX in a ScrollView
                  }
                </ScrollView>
              <TouchableHighlight
                  style={{ ...styles.closeButton, backgroundColor: "#2196F3" }}
                  onPress={() => {
                    this.setModalVisible(!modalVisible);
                  }}
                >
                  <Text style={styles.textStyle}>{this.props.exit}</Text>
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
                source={PlantImages[this.props.modalTitle]}
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
      //flex: 2,
      justifyContent: "center",
      alignItems: "center",
      //marginTop: 20,
    },
    modalView: {
      margin: 0,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      shadowColor: "#000",
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
      //backgroundColor: "#F194FF",
      borderRadius: 20,
      //padding: 10,
      elevation: 2,
    },
    closeButton: {
      backgroundColor: "#F194FF",
      borderRadius: 20,
      padding: 10,
      elevation: 2,
    },
    textStyle: {
      color: "black",
      fontWeight: "bold",
      textAlign: "center",
    },
    plantStyle: {
      width: 100,
      height: 100,
    }
  });