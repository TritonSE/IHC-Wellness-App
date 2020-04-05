import * as React from 'react';
<<<<<<< HEAD
import { Text, View, StyleSheet, TouchableOpacity, Button, Modal, FlatList, Alert } from 'react-native';
import AppHeader from '../../components/AppHeader';
import storeHelper from '../../Business/storeBackend'
import {pots, stems, flowers} from '../../Business/itemProperties.tsx';
=======
import { Button, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
>>>>>>> master

import PlantBackend from '../../Business/PlantBackend';
import StoreBackend from '../../Business/StoreBackend';
import AppHeader from '../../components/AppHeader';

export default class StorePage extends React.Component<object, object> {
  constructor(props: object) {
    super(props);
    this.state = {
      modalVisible: false,
      item: { name: '' },
      section: [],
    };
  }

  ItemCardRenderer = () => {
    
  }

  public render() {
    return (
      <View style={styles.container}>
        <AppHeader title="Store"/>

        <ScrollView>
          <TouchableOpacity style={styles.shopItem}>
            <Text>Sample TouchableOpacity</Text>
          </TouchableOpacity>

          <Button
            title="Get Terracotta"
            onPress={ async () => {
              const info = await StoreBackend.getItemInfo('terracotta', 'footers');
              console.log(info);
            } }
          />

          <Button
            title="Buy Terracotta"
            onPress={ () => { StoreBackend.buyItem('terracotta', 'footers'); } }
          />

          <Button
            title="Get Daisy"
            onPress={ () => { StoreBackend.getItemInfo('daisy', 'headers'); } }
          />

          <Button
            title="Buy Daisy"
            onPress={ () => { StoreBackend.buyItem('daisy', 'headers'); } }
          />

<<<<<<< HEAD
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
=======
          <Button
          title="Change Header"
          onPress={ () => { PlantBackend.changeHeader('sunflower', 'daisy', 0); } }
          />
>>>>>>> master

          <Button
            title="createDefault"
            onPress={ () => { PlantBackend.createDefaultPlantArray(); } }
          />

          <Button
            title="header"
            onPress={ () => { PlantBackend.getHeader(0); } }
         />

        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-start',
  },
  shopItem: {
    backgroundColor: 'blue',
    padding: 5,
  },
});
