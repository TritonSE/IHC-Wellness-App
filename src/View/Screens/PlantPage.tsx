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
      headerItems: [
        { name: 'headerOne', price: 10 },
        { name: 'headerTwo', price: 20 },
        { name: 'headerThree', price: 30 },
      ],
      bodyItems: [
        { name: 'bodyOne', price: 10 },
        { name: 'bodyTwo', price: 20 },
        { name: 'bodyThree', price: 30 },
      ],
      footerItems: [
        { name: 'footerOne', price: 10 },
        { name: 'footerTwo', price: 20 },
        { name: 'footerThree', price: 30 },
      ],
    };
    // this.PlantController.getBody();
  }

  public render() {

    // hard coded arrays
    const headerItems = [
      { name: 'headerOne', price: 10 },
      { name: 'headerTwo', price: 20 },
      { name: 'headerThree', price: 30 },
    ];

    const headerData = headerItems.map((item, i, arr) => {
      return (
        <View key={i}>
          <View
            style={{
              backgroundColor: 'blue',
              width: 10,
            }}
          >
          </View>
        </View>
      )
    });

    const bodyItems = [
      { name: 'bodyOne', price: 10 },
      { name: 'bodyTwo', price: 20 },
      { name: 'bodyThree', price: 30 },
    ];

    const bodyData = bodyItems.map((item, i, arr) => {
      return (
        <View key={i}>
          <View
            style={{
              backgroundColor: 'blue',
              width: 10,
            }}
          >
          </View>
        </View>
      )
    });

    const footerItems = [
      { name: 'footerOne', price: 10 },
      { name: 'footerTwo', price: 20 },
      { name: 'footerThree', price: 30 },
    ];

    const footerData = headerItems.map((item, i, arr) => {
      return (
        <View key={i}>
          <View
            style={{
              backgroundColor: 'blue',
              width: 10,
            }}
          >
          </View>
        </View>
      )
    });

    return (
      <View style={styles.container}>
        <AppHeader title="Plant"/>
        <FlatList
          contentContainerStyle={styles.plantList}
          data={this.state.plantBody}
          ListHeaderComponent={ this.renderPlantItem(this.state.plantHeader, styles.plantItem, headerData) }
          ListFooterComponent={ this.renderPlantItem(this.state.plantFooter, styles.plantItem, footerData) }
          renderItem={({ item }) => {
            return this.renderPlantItem(item, styles.plantItem, bodyData);
          }}
          keyExtractor={(item, index) => index.toString()}
        />
     </View>
    );
  }

  private renderPlantItem(plantItem: IPlantItem, plantStyle: object, data: any) {

    let itemImage: ImageSourcePropType = PlantImages[plantItem.name];

    return (
      <PlantCards
        modalTitle={ plantItem.name }
        transparent={ true } 
        image={ itemImage }
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
