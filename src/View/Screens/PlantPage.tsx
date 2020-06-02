import * as React from 'react';
import { Button, Dimensions, FlatList, StyleSheet, View } from 'react-native';

import { IPlantItem,
  PlantBodies, PlantFooters, PlantHeaders,
  PlantImages } from '../../../constants/Plants';
import PlantBackend, { IPlantItem } from '../../Business/PlantBackend';
import { IOwnedItem } from '../../Business/StoreBackend';
import AppHeader from '../../components/AppHeader';
import PlantCard from '../../components/PlantCard';

interface IState {
  plantBody: IPlantItem[];
  plantFooter: IPlantItem;
  plantHeader: IPlantItem;

  // Hardcoded values for owned items, will be replaced with backend calls
  headerItems: IOwnedItem[];
  bodyItems: IOwnedItem[];
  footerItems: IOwnedItem[];
}

const width = Dimensions.get('window').width;

// This class is further from completion than StorePage,
// but the elements needed to play around with style are here
export default class PlantPage extends React.Component<object, IState> {
  private readonly plantController: PlantBackend = PlantBackend.getInstance();

  constructor(props: object) {
    super(props);
    // TODO use this.plantController to set initial state to initial values
    // by calling its get methods and using setState with the resulting value
    this.plantController = PlantBackend.getInstance();
    this.state = {
      // TODO clean backend functions and uncomment these
      // plantBody: this.plantController.getBody(),
      // plantFooter: this.plantController.getFooter(),
      // plantHeader: this.plantController.getHeader(),
      plantBody: [...PlantBodies],
      plantFooter: PlantFooters[0],
      plantHeader: PlantHeaders[0],

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
    };
    // this.plantController.getBody();
  }

  public async componentDidMount() {
    // TODO componentDidMount can be async, if any async operations aren't
    //
    // await this.PlantController.getInitialValues();
    // this.setState();
  }

  public swapBodyHandler(plantItem: IOwnedItem, index: number) {
    this.setState( (prevState: IState) => {
      let newBodies = [...prevState.plantBody];
      newBodies[index] = {name: plantItem.name}
      return {
        plantBody: newBodies,
      };
    })
  }

  public swapHeaderHandler(plantItem: IOwnedItem) {
    this.setState( (prevState: IState) => ({
      plantHeader: {name: plantItem.name},
    }));
  }

  public swapFooterHandler(plantItem: IOwnedItem) {
    this.setState( (prevState: IState) => ({
      plantFooter: {name: plantItem.name},
    }));
  }

  public addItem(plantItem: IPlantItem) {
    this.setState( (prevState: IState) => {
      let newBodies = [{name: plantItem.name},...prevState.plantBody];
      console.log(JSON.stringify(prevState.bodyItems));
      return {
        plantBody: newBodies,
      };
    })
  }

  public render() {

    return (
      <View style={styles.container}>
        <AppHeader title="Plant"/>
        <Button
          title="Add Item"
          onPress={() => this.addItem({ ...PlantBodies[0]} )}
        /> 
        <FlatList
          contentContainerStyle={styles.plantList}
          data={this.state.plantBody}
          extraData={this.state}
          ListHeaderComponent={ this.renderPlantItem(this.state.plantHeader, styles.plantItem, this.state.headerItems, "header") }
          ListFooterComponent={ this.renderPlantItem(this.state.plantFooter, styles.plantItem, this.state.footerItems, "footer") }
          renderItem={({ item, index }) => {
            return this.renderPlantItem(item, styles.plantItem, this.state.bodyItems, "body", index);
          }}
          keyExtractor={(item, index) => index.toString()}
        />
        <Button
          title="Add Body"
          onPress={() => { PlantBackend.getInstance().addBody(0, {name:"long"}); }}
        />
     </View>
    );
  }

  private renderPlantItem(plantItem: IPlantItem, plantStyle: object, data: any, section: string, index?: number) {

    //let itemImage: ImageSourcePropType = PlantImages[plantItem.name];

    let swapHandler = section === "body" ? (swapItem: IOwnedItem) => this.swapBodyHandler(swapItem, index) 
      : section === "header" ? (swapItem: IOwnedItem) => this.swapHeaderHandler(swapItem)
      : (swapItem: IOwnedItem) => this.swapFooterHandler(swapItem)

    return (
      <PlantCard
        modalTitle={ plantItem.name }
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
