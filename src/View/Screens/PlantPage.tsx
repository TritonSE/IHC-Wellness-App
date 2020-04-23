import * as React from 'react';
import { Dimensions, FlatList, StyleSheet, View } from 'react-native';
import { DataProvider, LayoutProvider, RecyclerListView } from 'recyclerlistview';

import PlantBackend from '../../Business/PlantBackend';
import PlantCard, { Data } from '../PlantScreen/PlantCard';
import PlantData from '../PlantScreen/PlantData';
import PlantInfo from '../PlantScreen/PlantInfo';

const { height, width } = Dimensions.get('window');

export interface IState {
  dataProvider: DataProvider;
}

export default class PlantPage extends React.Component<object, IState> {
  public _layoutProvider: LayoutProvider;

  constructor(props: object) {
    super(props);
    this.state = {
      dataProvider: new DataProvider((r1, r2) => {
        return r1 !== r2;
      }).cloneWithRows(PlantData),
    };

    this._layoutProvider = new LayoutProvider((i) => {
      return this.state.dataProvider.getDataForIndex(i).type;
    },                                        (type, dim) => {
      switch (type) {
        case 'HEADER':
          dim.width = width;
          dim.height = 400;
          break;
        case 'BODY':
          dim.width = width;
          dim.height = 430;
          break;
        case 'BODY_LONG':
          dim.width = width;
          dim.height = 1780;
          break;
        case 'FOOTER':
          dim.width = width;
          dim.height = 200;
          break;
        default:
          dim.width = width;
          dim.height = 0;
      }
    });

    this.renderRow = this.renderRow.bind(this);
  }

  public renderRow(_type: any, data: Data) {
    return <PlantCard data={data}/>;
  }

  public getListItems(array: any[]) {
    const footer: number = array.filter(c => c.type === 'FOOTER').length;
    const body: number = array.filter(c => c.type === 'BODY').length;
    const bodyLong: number = array.filter(c => c.type === 'BODY_LONG').length;
    const header: number = array.filter(c => c.type === 'HEADER').length;
    return {
      listItems: [
        {
          type: 'entypo',
          name: 'flower',
          amount: footer.toString(),
        },
        {
          type: 'entypo',
          name: 'leaf',
          amount: body.toString(),
        },
        {
          type: 'entypo',
          name: 'tree',
          amount: bodyLong.toString(),
        },
        {
          type: 'ionicon',
          name: 'ios-rose',
          amount: header.toString(),
        },
      ],
    };
  }

  public render() {
    const array: any[] = this.state.dataProvider.getAllData();
    const itemData = this.getListItems(array);

    return (
      <View style={styles.container}>
        <View style={{ height, width }}>
          <PlantInfo {...itemData} />
          <RecyclerListView rowRenderer={this.renderRow} dataProvider={this.state.dataProvider}
                            layoutProvider={this._layoutProvider}/>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height,
    width,
    flex: 1,
  },
});
