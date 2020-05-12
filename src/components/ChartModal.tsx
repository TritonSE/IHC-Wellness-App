import * as React from 'react';
import { Alert, Modal, StyleSheet, Text, TouchableHighlight, View, Dimensions, ScrollView } from "react-native";
import { LineChart } from "react-native-chart-kit";

import ProfileBackend from '../Business/ProfileBackend';

interface IProps {
  modalTitle: string;
  transparent: boolean;
  animationType?: string;
  exit?: string;
  columns: any;
}

interface IState {
  modalVisible: boolean;
  data: any;
}

class ChartModal extends React.Component<IProps, IState>  {
    public static defaultProps = {
      animationType: "slide",
      exit: "Close Graphs"
    };

    constructor(props: IProps) {
        super(props);
        this.state = {
          modalVisible: false
        };
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
            //onRequestClose={() => {
              //Alert.alert("Charts have been closed.");
            //}}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>{this.props.modalTitle}</Text>
                <ScrollView
                  horizontal
                  contentContainerStyle={{
                    alignItems: 'flex-end', // To keep chart elements at y-bottom
                  }}
                >
                  {
                    this.props.columns // Render the JSX in a ScrollView
                  }
                </ScrollView>
                <TouchableHighlight
                  style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                  onPress={() => {
                    this.setModalVisible(!modalVisible);
                  }}
                >
                  <Text style={styles.textStyle}>{this.props.exit}</Text>
                </TouchableHighlight>
              </View>
            </View>
          </Modal>
  
          <TouchableHighlight
            style={styles.openButton}
            onPress={() => {
              this.setModalVisible(true);
            }}
          >
            <Text style={styles.textStyle}>
              {this.props.modalTitle}
            </Text>
          </TouchableHighlight>
        </View>
      );
    }
  }

  export default ChartModal;
  
  const styles = StyleSheet.create({
    centeredView: {
      flex: 2,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 20,
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
      backgroundColor: "#F194FF",
      borderRadius: 20,
      padding: 10,
      elevation: 2,
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center",
    },
    modalText: {
      //marginBottom: 15,
      //textAlign: "center",
      //padding: 100,
    }
  });
  