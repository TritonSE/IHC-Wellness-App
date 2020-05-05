import * as React from 'react';
import { Button, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import PlantBackend from '../../Business/PlantBackend';
import StoreBackend from '../../Business/StoreBackend';
import {flowers, pots, stems} from '../../Business/itemProperties';
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

  public render() {
    return (
      <View style={styles.container}>
        <AppHeader title="Store"/>
        <ScrollView>

        <Text style={styles.header}>Store Page!</Text>
        <View styles={{ flexDirection: 'row' }}>
          <TouchableOpacity style={styles.shopItem}>
            <Text>Item 1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shopItem}>
            <Text>Item 2</Text>
          </TouchableOpacity>
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
         <Button
          title="Buy Long"
          onPress={ () => {StoreBackend.buyItem('long', 'bodies'); } }
          />
          <Button
          title="Buy Short"
          onPress={ () => {StoreBackend.buyItem('short', 'bodies'); } }
          />

          <Button
          title="Add Body"
          onPress={ () => {PlantBackend.addBody(0, 'short'); } }
          />

          <Button
          title="Change Body"
          onPress={ () => {PlantBackend.changeBody(0, 'long', 0, 'short'); } }
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
          onPress={ () => {PlantBackend.getHeader(0); } }
        />
        <Button
          title="body"
          onPress={ () => {PlantBackend.getBody(0); } }
        />
        <Button
          title="footer"
          onPress={ () => {PlantBackend.getFooter(0); } }
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
                      StoreBackend.buyItem(this.state.item.name, this.state.section);
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
    paddingLeft: 30,
    paddingRight: 30,
    backgroundColor: 'green',
  },
  header: {
    fontSize: 30,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  shopItem: {
    backgroundColor: 'blue',
    padding: 5,
  },
});
