import * as React from 'react';
import { Dimensions, FlatList, Image, StyleSheet, View } from 'react-native';

import PlantBackend from '../../Business/PlantBackend';

const { height, width } = Dimensions.get('window');

import { IStoreItem, PlantBodies, PlantFooters, PlantHeaders, PlantImages } from '../../../constants/Plants';
import AppHeader from '../../components/AppHeader';

// TODO narrow down these types, should be IStore___ or IPlant___
interface IState {
  plantBody: IStoreItem[];
  plantFooter: IStoreItem;
  plantHeader: IStoreItem;
}

export default class PlantPage extends React.Component<object, IState> {
  constructor(props: object) {
    super(props);
    this.state = {
      // TODO clean backend functions and uncomment these
      // plantBody: PlantBackend.getBody(0),
      // plantFooter: PlantBackend.getFooter(0),
      // plantHeader: PlantBackend.getHeader(0),
      plantBody: [...PlantBodies],
      plantFooter: PlantFooters[0],
      plantHeader: PlantHeaders[0],
    };

  }

  public render() {
    return (
      <View style={styles.container}>
        <AppHeader title="Plant"/>
        <FlatList
          contentContainerStyle={styles.plantList}
          data={this.state.plantBody}
          ListHeaderComponent={ this.renderPlantItem(this.state.plantHeader) }
          ListFooterComponent={ this.renderPlantItem(this.state.plantFooter) }
          renderItem={(data) => {
            const plant = data.item;
            return this.renderPlantItem(plant);
          }}
          keyExtractor={(item, index) => index.toString()}
        />
     </View>
    );
  }

  private renderPlantItem(plantItem: IStoreItem) {
    return (
      <Image
        style={styles.plantItem}
        source={ PlantImages[plantItem.name] }
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // height,
    width,
    alignItems: 'center',
    flex: 1,
  },
  plantItem: {
    // borderColor: 'black',
    // borderWidth: 3,
    height: 100,
    width: 100,
  },
  plantList: {
    width,
    alignItems: 'center',
  }
});
