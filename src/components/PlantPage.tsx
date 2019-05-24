import * as React from 'react';
import { Dimensions, StyleSheet, View } from "react-native";
import { LayoutProvider, DataProvider, RecyclerListView } from 'recyclerlistview';
import PlantCard, { Data } from './PlantCard';
import PlantData from './PlantData';

let { height, width } = Dimensions.get('window');

export interface IState {
  dataProvider: DataProvider;
}

export default class PlantPage extends React.Component<{}, IState> {
  _layoutProvider: LayoutProvider;

  constructor(args: any) {
    super(args);
    this.state = {
      dataProvider: new DataProvider((r1, r2) => {
        return r1 !== r2
      }).cloneWithRows(PlantData)
    };
    
    this._layoutProvider = new LayoutProvider((i) => {
      return this.state.dataProvider.getDataForIndex(i).type;
    }, (type, dim) => {
      switch (type) {
        case "HEADER":
            dim.width = width;
            dim.height = 400;
            break;
        case "BODY":
            dim.width = width;
            dim.height = 430;
            break;
        case "BODY_LONG":
            dim.width = width;
            dim.height = 1780;
            break;
        case "FOOTER":
            dim.width = width;
            dim.height = 200;
            break;
        default:
            dim.width = width;
            dim.height = 0;
      }
    });

    this._renderRow = this._renderRow.bind(this);
  }


  _renderRow(_type: any, data: Data) {
    return <PlantCard data={data}/>;
  }

  public render() {
    return (
      <View style={styles.container}>
        <View style={{height: height, width: width}}>
            <RecyclerListView rowRenderer={this._renderRow} dataProvider={this.state.dataProvider}
                              layoutProvider={this._layoutProvider}/>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: height, 
    width: width
  }
});
