import * as React from 'react';
import { Dimensions, FlatList, ImageSourcePropType, StyleSheet, View } from 'react-native';

import { PlantBodies, PlantFooters, PlantHeaders,
         PlantImages } from '../../../constants/Plants';
import PlantBackend, { IPlantItem } from '../../Business/PlantBackend';
import AppHeader from '../../components/AppHeader';
import PlantCard from '../../components/PlantCard';

interface IState {
  plantBody: IPlantItem[];
  plantFooter: IPlantItem;
  plantHeader: IPlantItem;
  headerItems: IPlantItem[];
  bodyItems: IPlantItem[];
  footerItems: IPlantItem[];
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
      // plantBody: PlantBackend.getBody(0),
      // plantFooter: PlantBackend.getFooter(0),
      // plantHeader: PlantBackend.getHeader(0),
      plantBody: [...PlantBodies],
      plantFooter: PlantFooters[0],
      plantHeader: PlantHeaders[0],
<<<<<<< HEAD
      // hard coded arrays
=======
      // TODO remove prices here, only name is needed for rendering
      // so IPlantItem only has the name field
>>>>>>> origin/master
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
    // this.plantController.getBody();
  }

  public async componentDidMount() {
    // TODO componentDidMount can be async, if any async operations aren't
    //
    // await this.PlantController.getInitialValues();
    // this.setState();
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
<<<<<<< HEAD

    //let itemImage: ImageSourcePropType = PlantImages[plantItem.name];
=======
    // TODO const is preferred to let in cases where the value does not change
    let itemImage: ImageSourcePropType = PlantImages[plantItem.name];
>>>>>>> origin/master

    return (
      <PlantCard
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
