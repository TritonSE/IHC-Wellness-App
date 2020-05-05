import * as React from 'react';
<<<<<<< HEAD
import { Button, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import PlantBackend from '../../Business/PlantBackend';
import StoreBackend from '../../Business/StoreBackend';
=======
import { Button, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {flowers, pots, stems} from '../../Business/itemProperties.tsx';
import plantHelper from '../../Business/plantBackend'
import storeHelper from '../../Business/storeBackend'
>>>>>>> 745ae9e080e3adda6e4c343ab7af48b7d9657f7f
import AppHeader from '../../components/AppHeader';

export default class StorePage extends React.Component<object, object> {
  constructor(props: object) {
    super(props);
    this.state = {
      modalVisible: false,
<<<<<<< HEAD
      item: { name: '' },
=======
      item: { name: ''},
>>>>>>> 745ae9e080e3adda6e4c343ab7af48b7d9657f7f
      section: [],
    };
  }

  public render() {
    return (
      <View style={styles.container}>
        <AppHeader title="Store"/>
<<<<<<< HEAD

        <ScrollView>
=======
        <Text style={styles.header}>Store Page!</Text>
        <View styles={{ flexDirection: 'row' }}>
          <TouchableOpacity style={styles.shopItem}>
            <Text>Item 1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shopItem}>
            <Text>Item 2</Text>
          </TouchableOpacity>
>>>>>>> 745ae9e080e3adda6e4c343ab7af48b7d9657f7f
          <TouchableOpacity style={styles.shopItem}>
            <Text>Sample TouchableOpacity</Text>
          </TouchableOpacity>
<<<<<<< HEAD

          <Button
            title="Get Terracotta"
            onPress={ async () => {
              const info = await StoreBackend.getItemInfo('terracotta', 'footers');
              console.log(info);
            } }
=======
          <Button
          title="Buy Terracotta"
          onPress={ () => { storeHelper.buyItem('terracotta', 'footers'); } }
>>>>>>> 745ae9e080e3adda6e4c343ab7af48b7d9657f7f
          />

          <Button
<<<<<<< HEAD
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

          <Button
          title="Change Header"
          onPress={ () => { PlantBackend.changeHeader('sunflower', 'daisy', 0); } }
          />

          <Button
            title="createDefault"
            onPress={ () => {
              StoreBackend.createOwned();
              PlantBackend.createDefaultPlantArray();
            } }
          />

          <Button
            title="header"
            onPress={ () => { PlantBackend.getHeader(0); } }
         />
=======
          title="Buy Long"
          
          onPress={ () => {storeHelper.buyItem('long', 'bodies'); } }
          />
          <Button
          title="Buy Short"
          
          onPress={ () => {storeHelper.buyItem('short', 'bodies'); } }
          />

          <Button
          title="Add Body"
          onPress={ () => {plantHelper.addBody(0, 'short'); } }
          />

          <Button
          title="Change Body"
          onPress={ () => {plantHelper.changeBody(0, 'short', 1, 'long'); } }
          />

        <Button
          title="createDefault"
          onPress={ () => {
            storeHelper.createOwned();
            plantHelper.createDefaultPlantArray();
          } }
          />
        <Button
          title="header"
          onPress={ () => {plantHelper.getHeader(0); } }
        />
        <Button
          title="body"
          onPress={ () => {plantHelper.getBody(0); } }
        />
        <Button
          title="footer"
          onPress={ () => {plantHelper.getFooter(0); } }
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
                      this.setState({ modalVisible: false });
                      storeHelper.buyItem(this.state.item.name, this.state.section);
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
>>>>>>> 745ae9e080e3adda6e4c343ab7af48b7d9657f7f

        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
<<<<<<< HEAD
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-start',
=======
  header: {
    fontSize: 30,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  container: {
    paddingLeft: 30,
    paddingRight: 30,
    backgroundColor: 'green',
>>>>>>> 745ae9e080e3adda6e4c343ab7af48b7d9657f7f
  },
  shopItem: {
    backgroundColor: 'blue',
    padding: 5,
<<<<<<< HEAD
=======
    backgroundColor: 'blue',
>>>>>>> 745ae9e080e3adda6e4c343ab7af48b7d9657f7f
  },
});
