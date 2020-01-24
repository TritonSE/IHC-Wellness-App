import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Button } from 'react-native';
import AppHeader from '../../components/AppHeader';
import storeHelper from '../../Business/storeBackend'


export default class StorePage extends React.Component<object, object> {
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
          title="Buy Item"
          onPress={ ()=>{storeHelper.buyItem("terracotta")} }
        />
        <Button
          title="Add Money"
          onPress={ ()=>{storeHelper.addMoney(10.4)} }
        />
        <Button
        title="Get Items"
        onPress={ ()=>{console.log(storeHelper.getItems())}}
        />
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
