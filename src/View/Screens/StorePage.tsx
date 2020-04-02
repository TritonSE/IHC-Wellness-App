import * as React from 'react';
import { Button, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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

          <Button
          title="Change Header"
          onPress={ () => { PlantBackend.changeHeader('sunflower', 'daisy', 0); } }
          />

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
