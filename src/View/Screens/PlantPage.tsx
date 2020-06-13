import * as React from 'react';
import { Button, Dimensions, FlatList, StyleSheet, View } from 'react-native';

<<<<<<< HEAD
import { PlantBodies, PlantFooters, PlantHeaders,
  PlantImages } from '../../../constants/Plants';
import PlantBackend, { IPlantItem } from '../../Business/PlantBackend';
import StoreBackend, { IOwnedItem } from '../../Business/StoreBackend';
=======
import { PlantBodies, PlantFooters, PlantHeaders } from '../../../constants/Plants';
import PlantBackend, { IPlant, IPlantItem } from '../../Business/PlantBackend';
import StoreBackend, { IOwned, IOwnedItem } from '../../Business/StoreBackend';
>>>>>>> origin/master
import AppHeader from '../../components/AppHeader';
import PlantCard from '../../components/PlantCard';

interface IState {
  // Members of the plant
  plantBody: IPlantItem[];
  plantFooter: IPlantItem;
  plantHeader: IPlantItem;

<<<<<<< HEAD
  // Hardcoded values for owned items, will be replaced with backend calls
  headerItems: IOwnedItem[];
  bodyItems: IOwnedItem[];
  footerItems: IOwnedItem[];
=======
  // Members of the owned items that can be applied to the plant
  ownedHeaders: IOwnedItem[];
  ownedBodies: IOwnedItem[];
  ownedFooters: IOwnedItem[];
>>>>>>> origin/master
}

const width = Dimensions.get('window').width;

export default class PlantPage extends React.Component<object, IState> {
  private readonly plantController: PlantBackend = PlantBackend.getInstance();
  private readonly storeController: StoreBackend = StoreBackend.getInstance();

  constructor(props: object) {
    super(props);
<<<<<<< HEAD
    // TODO use this.plantController to set initial state to initial values
    // by calling its get methods and using setState with the resulting value
    this.plantController = PlantBackend.getInstance();

    this.state = {
      // TODO clean backend functions and uncomment these DONE
      plantBody: this.plantController.getBody(),
      plantFooter: this.plantController.getFooter(),
      plantHeader: this.plantController.getHeader(),

      // plantBody: [...PlantBodies],
      // plantFooter: PlantFooters[0],
      // plantHeader: PlantHeaders[0],

      // hard coded arrays
      headerItems: [
        { name: "Sunflower", owned: 5, used: 3, available: true },
        { name: "Carnation", owned: 5, used: 3, available: true },
        { name: "redRose", owned: 5, used: 3, available: true }
      ],
      bodyItems: [
        { name: "Body", owned: 5, used: 3, available: true },
        { name: "Long Body", owned: 5, used: 3, available: true },
        { name: "Stem", owned: 5, used: 3, available: true }
      ],
      footerItems: [
        { name: "Clay", owned: 5, used: 3, available: true },
        { name: "Terracotta", owned: 5, used: 3, available: true },
        { name: "linedVase", owned: 5, used: 3, available: true },
        { name: "redPot", owned: 5, used: 3, available: true },
        { name: "standardPot", owned: 5, used: 3, available: true }
      ],
=======

    // Set state to incorrect values before actual values are loaded in componentDidMount()
    this.state = {
      plantBody: [...PlantBodies],
      plantFooter: PlantFooters[0],
      plantHeader: PlantHeaders[0],

      ownedHeaders: [{ name: 'Loading', owned: 0, used: 0, available: false }],
      ownedBodies: [{ name: 'Loading', owned: 0, used: 0, available: false }],
      ownedFooters: [{ name: 'Loading', owned: 0, used: 0, available: false }],
>>>>>>> origin/master
    };
  }

  public componentDidMount() {
    this.plantController.getPlant()
    .then((plant: IPlant) => {
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
<<<<<<< HEAD
    this.setState( (prevState: IState) => {
      plantHeader: {name: plantItem.name},
    });
  }

  public swapFooterHandler(plantItem: IOwnedItem) {
    this.setState( (prevState: IState) => {
      plantFooter: {name: plantItem.name},
    });
=======
    this.setState((prevState: IState) => ({
      plantHeader: { name: plantItem.name },
    }));
  }

  public swapFooterHandler(plantItem: IOwnedItem) {
    this.setState((prevState: IState) => ({
      plantFooter: { name: plantItem.name },
    }));
>>>>>>> origin/master
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
            this.renderPlantItem(this.state.plantHeader, styles.plantItem, this.state.ownedHeaders, 'header')
          }
          ListFooterComponent={
            this.renderPlantItem(this.state.plantFooter, styles.plantItem, this.state.ownedFooters, 'footer')
          }
          renderItem={
            ({ item, index }) => this.renderPlantItem(item, styles.plantItem, this.state.ownedBodies, 'body', index)
          }
          keyExtractor={(item, index) => index.toString()}
        />
        <Button
          title="Add Body"
          onPress={() => { PlantBackend.getInstance().addBody(0, {name:"long"}); }}
        />
     </View>
    );
  }

  // TODO remove data parameter, get data in PlantCard with call to StoreBackend
  private renderPlantItem(plantItem: IPlantItem, plantStyle: object, data: any, section: string, index?: number) {

    // let itemImage: ImageSourcePropType = PlantImages[plantItem.name];

    const swapHandler = section === 'body'
                        ? (swapItem: IOwnedItem) => this.swapBodyHandler(swapItem, index || 0)
                        : section === 'header'
                        ? (swapItem: IOwnedItem) => this.swapHeaderHandler(swapItem)
                        : (swapItem: IOwnedItem) => this.swapFooterHandler(swapItem);

    return (
      <PlantCard
<<<<<<< HEAD
        modalTitle={ plantItem.name }
=======
        plantName={ plantItem.name }
>>>>>>> origin/master
        transparent={ true }
        data={ data }
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
