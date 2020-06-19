import * as React from 'react';
import { Button, Dimensions, FlatList, StyleSheet, View } from 'react-native';

import { PlantBodies, PlantFooters, PlantHeaders } from '../../../constants/Plants';
import PlantBackend, { IPlant, IPlantItem } from '../../Business/PlantBackend';
import StoreBackend, { IOwned, IOwnedItem } from '../../Business/StoreBackend';
import AppHeader from '../../components/AppHeader';
import PlantCard from '../../components/PlantCard';

interface IState {
  // Members of the plant
  plantBody: IPlantItem[];
  plantFooter: IPlantItem;
  plantHeader: IPlantItem;

  // Members of the owned items that can be applied to the plant
  ownedHeaders: IOwnedItem[];
  ownedBodies: IOwnedItem[];
  ownedFooters: IOwnedItem[];
}

const width = Dimensions.get('window').width;

export default class PlantPage extends React.Component<object, IState> {
  private readonly plantController: PlantBackend = PlantBackend.getInstance();
  private readonly storeController: StoreBackend = StoreBackend.getInstance();

  constructor(props: object) {
    super(props);

    // Set state to incorrect values before actual values are loaded in componentDidMount()
    this.state = {
      plantBody: [...PlantBodies],
      plantFooter: PlantFooters[0],
      plantHeader: PlantHeaders[0],

      ownedHeaders: [{ name: 'Loading', owned: 0, used: 0, available: false }],
      ownedBodies: [{ name: 'Loading', owned: 0, used: 0, available: false }],
      ownedFooters: [{ name: 'Loading', owned: 0, used: 0, available: false }],
    };
  }

  public componentDidMount() {
    this.plantController.getPlant()
    .then((plant: IPlant) => {
      console.log(`PlantPage: plant is ${JSON.stringify(plant)}`);
      this.setState((prevState: IState) => ({
        plantHeader: plant.header,
        plantBody: plant.body,
        plantFooter: plant.footer,
      }));
    });

    this.storeController.getOwned()
    .then((owned: IOwned) => {
      this.setState((prevState: IState) => ({
        ownedHeaders: owned.headers.filter((o) => o.available),
        ownedBodies: owned.bodies.filter((o) => o.available),
        ownedFooters: owned.footers.filter((o) => o.available),
      }));
    });

    setTimeout(() => console.log(`ownedHeaders: ${JSON.stringify(this.state.ownedHeaders)}`), 1000);
  }

  public swapBodyHandler(plantItem: IOwnedItem, index: number) {
    this.setState((prevState: IState) => {
      const newBodies = [...prevState.plantBody];
      newBodies[index] = { name: plantItem.name };
      return {
        plantBody: newBodies,
      };
    });
  }

  public swapHeaderHandler(plantItem: IOwnedItem) {
    this.setState(() => ({
      plantHeader: { name: plantItem.name },
    }));
  }

  public swapFooterHandler(plantItem: IOwnedItem) {
    this.setState(() => ({
      plantFooter: { name: plantItem.name },
    }));
  }

  public addItem(plantItem: IPlantItem) {
    this.setState((prevState: IState) => {
      const newBodies = [{ name: plantItem.name }, ...prevState.plantBody];
      console.log(JSON.stringify(prevState.ownedBodies));
      return {
        plantBody: newBodies,
      };
    });
  }

  public render() {

    return (
      <View style={styles.container}>
        <AppHeader title="Plant"/>
        <Button
          title="Add Item"
          onPress={() => this.addItem({ ...PlantBodies[0] })}
        />
        <FlatList
          contentContainerStyle={styles.plantList}
          data={this.state.plantBody}
          extraData={this.state}
          ListHeaderComponent={
            this.renderPlantItem(this.state.plantHeader, this.state.ownedHeaders, 'header')
          }
          ListFooterComponent={
            this.renderPlantItem(this.state.plantFooter, this.state.ownedFooters, 'footer')
          }
          renderItem={
            ({ item, index }) => this.renderPlantItem(item, this.state.ownedBodies, 'body', index)
          }
          keyExtractor={(item, index) => index.toString()}
        />
     </View>
    );
  }

  // TODO remove data parameter, get data in PlantCard with call to StoreBackend
  private renderPlantItem(plantItem: IPlantItem, ownedItems: IOwnedItem[],
                          section: string, index?: number) {

    const swapHandler = section === 'body'
                        ? (swapItem: IOwnedItem) => this.swapBodyHandler(swapItem, index || 0)
                        : section === 'header'
                        ? (swapItem: IOwnedItem) => this.swapHeaderHandler(swapItem)
                        : (swapItem: IOwnedItem) => this.swapFooterHandler(swapItem);

    return (
      <PlantCard
        plantName={ plantItem.name }
        data={ ownedItems }
        swapPlant={ swapHandler }
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
  },
});
