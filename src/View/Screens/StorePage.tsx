import * as React from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';

import StoreBackend from '../../Business/StoreBackend';

import { IStoreItem, PlantBodies, PlantFooters, PlantHeaders } from 'app/constants/Plants';
import StoreCard from 'app/src/components/StoreCard';
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

  public componentDidMount() {
    console.log('TODO StorePage needs to check whether default store arrays exist yet');
  }

  public render() {
    return (
      <View style={styles.container}>
        <AppHeader title="Store"/>

        <ScrollView>
          {/*
          <Button
            title="createDefault"
            onPress={ () => {
              StoreBackend.createOwned();
              PlantBackend.createDefaultPlantArray();
            } }
          />
          */}

          <FlatList
            horizontal={true}
            data={PlantHeaders}
            renderItem={(plant: IStoreItem) => {
              return (
                <StoreCard
                  name={plant.item.name}
                  price={plant.item.price}
                />
              );
            }}
            keyExtractor={(item, index) => index.toString()}
          />

          <FlatList
            horizontal={true}
            data={PlantBodies}
            renderItem={(plant: IStoreItem) => {
              return (
                <StoreCard
                  name={plant.item.name}
                  price={plant.item.price}
                />
              );
            }}
            keyExtractor={(item, index) => index.toString()}
          />

          <FlatList
            horizontal={true}
            data={PlantFooters}
            renderItem={(plant: IStoreItem) => {
              return (
                <StoreCard
                  name={plant.item.name}
                  price={plant.item.price}
                />
              );
            }}
            keyExtractor={(item, index) => index.toString()}
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
    borderColor: 'red',
    borderWidth: 5,
    height: 100,
    width: 100,
    padding: 5,
  },
});
