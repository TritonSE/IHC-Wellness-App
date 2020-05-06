import * as React from 'react';
import { Button, Image, ImageSourcePropType, Modal, StyleSheet, Text,
         TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

import { IPlantItem, PlantImages } from '../../../constants/Plants';
import StoreBackend from '../../Business/StoreBackend';

interface IProps extends IPlantItem {
  sectionName: string;
}

interface IState {
  modalVisible: boolean;
}

class StoreCard extends React.Component<IProps, IState> {
  public readonly name: string = this.props.name;
  public readonly price: number = this.props.price;
  public readonly sectionName: string = this.props.sectionName;

  private readonly image: ImageSourcePropType = PlantImages[this.name];

  constructor(props: IProps) {
    super(props);
    this.state = {
      modalVisible: false,
    };
  }

  public render() {
    return (
      <View>
        {/* View of item in FlatList */}
        <TouchableOpacity
          onPress={() => {
            this.setModalVisible(true);
          }}
        >
          <View>
            <Image
              style={styles.sectionImage}
              source={ this.image }
            />
            <Text>{this.name}</Text>
            <Text>${this.price.toFixed(2)}</Text>
          </View>
        </TouchableOpacity>

        {/* View of modal after press activation */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => this.setModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => this.setModalVisible(false)}>
          <View style={styles.modalScreen}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalCard}>
                <Image
                  style={styles.modalImage}
                  source={this.image}
                />
                <Text>{this.name}</Text>
                <Button
                  title={`Buy for $${this.price}`}
                  onPress={() => {
                    console.log(`Attempting to buy ${this.name} for $${this.price}`);
                    StoreBackend.buyItem(this.name, this.sectionName);
                  }}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    );
  }

  private setModalVisible(visible: boolean) {
    this.setState({ modalVisible: visible });
  }
}

const styles = StyleSheet.create({
  modalCard: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderColor: 'blue',
    borderRadius: 30,
    borderWidth: 2,
  },
  modalImage: {
    height: 200,
    width: 200,
  },
  modalScreen: {
    alignContent: 'center',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  sectionImage: {
    height: 100,
    width: 100,
  },
});

export default StoreCard;
