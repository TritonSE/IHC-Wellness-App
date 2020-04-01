import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Button, Modal } from 'react-native';

import PlantBackend from '../../Business/PlantBackend';
import StoreBackend from '../../Business/StoreBackend';
import AppHeader from '../../components/AppHeader';

export default class StorePage extends React.Component<object, object> {
  constructor() {
    super();
    this.state = {
      modalVisible: false,
      item: {name: ""},
      section: []
    };
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
            var info = await StoreBackend.getItemInfo("terracotta", "footers");
            console.log(info);

          } }
          />
          <Button
          title="Buy Terracotta"
          onPress={ ()=>{StoreBackend.buyItem("terracotta","footers")} }
          />


          <Button
          title="Buy Daisy"
          onPress={ ()=>{StoreBackend.buyItem("daisy","headers")} }
          />
          <Button
          title="Change Header"
          onPress={ ()=>{PlantBackend.changeHeader("sunflower","daisy",0)} }
          />

        <Button
          title="createDefault"
          onPress={ ()=>{PlantBackend.createDefaultPlantArray()} }
          />
        <Button
          title="header"
          onPress={ ()=>{PlantBackend.getHeader(0)} }
        />
        <Button
          title="body"
          onPress={ ()=>{PlantBackend.getBody(0)} }
        />
        <Button
          title="footer"
          onPress={ ()=>{PlantBackend.getFooter(0)} }
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
                        StoreBackend.buyItem(this.state.item.name, this.state.section)
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
