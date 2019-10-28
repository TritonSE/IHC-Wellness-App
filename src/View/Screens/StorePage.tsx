import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import AppHeader from '../../components/AppHeader';

export default class StorePage extends React.Component<object, object> {
  public render() {
    return (
      <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
        <AppHeader title="Store"/>
        <Text style={styles.header}>Store Page!</Text>
        <View styles={styles.shopRow}>
          <TouchableOpacity sytle={styles.shopItem}>
            <Text>Item 1</Text>
          </TouchableOpacity>
          <TouchableOpacity sytle={styles.shopItem}>
            <Text>Item 2</Text>
          </TouchableOpacity>
          <TouchableOpacity sytle={styles.shopItem}>
            <Text>Item 3</Text>
          </TouchableOpacity>
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
  shopRow: {
    flexDirection: 'row'
  },
  container: {
    paddingLeft: 30,
    paddingRight: 30,
    backgroundColor: 'green'
  },
  shopItem: {
    backgroundColor: 'blue',
    padding: 5
  }
});
