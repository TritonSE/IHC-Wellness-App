import * as React from 'react';
import { Modal, StyleSheet, Text, TouchableHighlight, View, ScrollView, Image, TouchableOpacity } from "react-native";

interface IProps {
  modalTitle: string;
  transparent: boolean;
  animationType?: string;
  exit?: string;
  image: any;
  data: any;
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
                    this.props.data //Render the JSX in a ScrollView
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
                source={this.props.image}
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