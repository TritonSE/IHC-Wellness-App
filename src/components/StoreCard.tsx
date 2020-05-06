import * as React from 'react';
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { IStoreItem, PlantImages } from 'app/constants/Plants';

class StoreCard extends React.Component<IStoreItem, IStoreItem> {
  public readonly name: string;
  public readonly price: number;

  constructor(props: IStoreItem) {
    super(props);
    this.name = this.props.name;
    this.price = this.props.price;
  }

  public render() {
    return (
      <TouchableOpacity
        onPress={() => {
          console.log(`${this.name} pressed`);
        }}
      >
        <View>
          <Image
            style={styles.plantImage}
            source={ PlantImages[this.name] }
          />
          <Text>{this.name}</Text>
          <Text>${this.price.toFixed(2)}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  plantImage: {
    //borderColor: 'red',
    //borderWidth: 6,
    height: 100,
    width: 100,
  },
});

export default StoreCard;
