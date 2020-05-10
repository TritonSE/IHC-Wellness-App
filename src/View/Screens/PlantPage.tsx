import * as React from 'react';
import { Dimensions, FlatList, Image, StyleSheet, View } from 'react-native';

import PlantBackend from '../../Business/PlantBackend';

import { IPlantItem,
         PlantBodies, PlantFooters, PlantHeaders,
         PlantImages } from '../../../constants/Plants';
import AppHeader from '../../components/AppHeader';

// TODO narrow down these types, should be IStore___ or IPlant___
interface IState {
  plantBody: IPlantItem[];
  plantFooter: IPlantItem;
  plantHeader: IPlantItem;
}
  
const { height, width } = Dimensions.get('window');

// This class is further from completion than StorePage,
// but the elements needed to play around with style are here
export default class PlantPage extends React.Component<object, IState> {
  private readonly PlantController: PlantBackend = PlantBackend.getInstance();

  constructor(props: object) {
    super(props);
    // this.PlantController = PlantBackend.getInstance();
    this.state = {
      // TODO clean backend functions and uncomment these
      // plantBody: PlantBackend.getBody(0),
      // plantFooter: PlantBackend.getFooter(0),
      // plantHeader: PlantBackend.getHeader(0),
      plantBody: [...PlantBodies],
      plantFooter: PlantFooters[0],
      plantHeader: PlantHeaders[0],
    };
    // this.PlantController.getBody();
  }

  public render() {
    return (
      <View style={styles.container}>
        <AppHeader title="Plant"/>
        <FlatList
          contentContainerStyle={styles.plantList}
          data={this.state.plantBody}
          ListHeaderComponent={ this.renderPlantItem(this.state.plantHeader, styles.plantItem) }
          ListFooterComponent={ this.renderPlantItem(this.state.plantFooter, styles.plantItem) }
          renderItem={({ item }) => {
            return this.renderPlantItem(item, styles.plantItem);
          }}
          keyExtractor={(item, index) => index.toString()}
        />
     </View>
    );
  }

  private renderPlantItem(plantItem: IPlantItem, plantStyle: object) {
    return (
      <Image
        style={plantStyle}
        source={ PlantImages[plantItem.name] }
      />
    );
  }
}

// Element styling akin to CSS, check https://reactnative.dev/docs/flexbox for info
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
