import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Button, Modal, FlatList, Alert } from 'react-native';
import AppHeader from '../../components/AppHeader';
import storeHelper from '../../Business/storeBackend'
import {pots, stems, flowers} from '../../Business/itemProperties.tsx';


export default class StorePage extends React.Component<object, object> {
  constructor() {
    super();
    this.state = {
      modalVisible: false,
      item: {name: ""},
      section: []
    };
  }

  ItemCardRenderer = () => {
    
  }

  public render() {
    return (
      <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
        <AppHeader title="Store"/>
        <Text style={styles.header}>Store Page!</Text>
        <View styles={{flexDirection: 'row'}}>
          <TouchableOpacity style={styles.shopItem}>
            <Text>Item 1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shopItem}>
            <Text>Item 2</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shopItem}>
            <Text>Item 3</Text>
          </TouchableOpacity>
          <Button
          title="Get Terracotta"
          onPress={ async ()=>{
            var info = await storeHelper.getItemInfo("terracotta", "pots");
            console.log(info);
            // this.setState({item: storeHelper.getItemInfo("terracotta",pots)})
            // this.setState({modalVisible: true})
            // this.setState({section: pots})
          } }
          />
          <Button
          title="Buy Terracotta"
          onPress={ ()=>{storeHelper.buyItem("terracotta","pots")} }
          />
          <Button
          title="Buy Long Stem"
          onPress={ ()=>{storeHelper.buyItem("long","stems")} }
          />
        <Button
          title="Add Money"
          onPress={ ()=>{storeHelper.addMoney(10.4)} }
        />

        <FlatList
          data={
            [
              {key: 'Get Terracotta'},
              {key: 'Buy Terracotta'},
              {key: 'Buy Long Stem'},
              {key: 'Add Money'}
            ]
          }
          renderItem={({item}) => <Button title={item.key} onPress={()=>Alert.alert(item.key)} />}
          horizontal={true}
        />

        <Modal
             transparent = {true}
             visible = {this.state.modalVisible}>

             <View >
                <Text>Name: {this.state.item.name}</Text>
                <View >
                  <Button
                    title="Buy item"
                    onPress={async () => {
                        this.setState({modalVisible: false });
                        storeHelper.buyItem(this.state.item.name, this.state.section)
                      }
                    }
                  />
                  <Button
                    title="Cancel"
                    onPress={() => this.setState({ modalVisible: false })}
                  />
                </View>
             </View>
        </Modal>

        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    fontSize: 30,
    flexDirection: 'column',
    justifyContent: 'flex-start'
  },
  container: {
    paddingLeft: 30,
    paddingRight: 30,
    backgroundColor: 'green'
  },
  shopItem: {
    padding: 5,
    backgroundColor: 'blue'
  }
});
