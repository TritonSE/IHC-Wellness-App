import * as React from 'react';
import { Dimensions, FlatList, Image, StyleSheet, View } from 'react-native';

import { IStoreItem,
         PlantBodies, PlantFooters, PlantHeaders,
         PlantImages } from '../../../constants/Plants';
import PlantBackend, { IPlantItem } from '../../Business/PlantBackend';
import AppHeader from '../../components/AppHeader';

// TODO refactor to use IPlantItem as type
interface IState {
  plantBody: IPlantItem[];
  plantFooter: IPlantItem;
  plantHeader: IPlantItem;
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
