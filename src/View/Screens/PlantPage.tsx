import * as React from 'react';
import { Dimensions, FlatList, ImageSourcePropType, Image, StyleSheet, View } from 'react-native';

import PlantBackend from '../../Business/PlantBackend';

import { IPlantItem,
         PlantBodies, PlantFooters, PlantHeaders,
         PlantImages } from '../../../constants/Plants';

import AppHeader from '../../components/AppHeader';
import PlantCards from '../../components/PlantCards';

// TODO narrow down these types, should be IStore___ or IPlant___
interface IState {
  plantBody: IPlantItem[];
  plantFooter: IPlantItem;
  plantHeader: IPlantItem;
  headerItems: IPlantItem[];
  bodyItems: IPlantItem[];
  footerItems: IPlantItem[];
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
      // hard coded arrays
      headerItems: [
        { name: "Sunflower", price: 1.25 },
        { name: "Carnation", price: 1.25 },
        { name: "redRose", price: 1.25 }
      ],
      bodyItems: [
        { name: "Body", price: 1.25 },
        { name: "Long Body", price: 2.5 },
        { name: "Stem", price: 1.25 }
      ],
      footerItems: [
        { name: "Clay", price: 1.25 },
        { name: "Terracotta", price: 1.25 },
        { name: "linedVase", price: 1.25 },
        { name: "redPot", price: 1.25 },
        { name: "standardPot", price: 1.25 }
      ],
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
          ListHeaderComponent={ this.renderPlantItem(this.state.plantHeader, styles.plantItem, this.state.headerItems) }
          ListFooterComponent={ this.renderPlantItem(this.state.plantFooter, styles.plantItem, this.state.footerItems) }
          renderItem={({ item }) => {
            return this.renderPlantItem(item, styles.plantItem, this.state.bodyItems);
          }}
          keyExtractor={(item, index) => index.toString()}
        />
     </View>
    );
  }

  private renderPlantItem(plantItem: IPlantItem, plantStyle: object, data: any) {

    //let itemImage: ImageSourcePropType = PlantImages[plantItem.name];

    return (
      <PlantCards
        modalTitle={ plantItem.name }
        transparent={ true } 
        data={ data }
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
    //borderColor: 'black',
    //borderWidth: 3,
    height: 100,
    width: 100,
  },
  plantList: {
    width,
    alignItems: 'center',
  }
});
