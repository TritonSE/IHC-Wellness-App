import * as React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { PlantBodies, PlantFooters, PlantHeaders } from '../../../constants/Plants';

import StoreSection from '../../../src/components/Store/StoreSection';
import AppHeader from '../../components/AppHeader';

export default class StorePage extends React.Component<object, object> {
  constructor(props: object) {
    super(props);
  }

  public componentDidMount() {
    console.log('TODO StorePage needs to check whether default store arrays exist yet');
  }

  public render() {
    return (
      <View style={styles.pageContainer}>
        <AppHeader title="Store"/>

        <ScrollView>

          <StoreSection
            sectionTitle="Heads"
            plantItems={ PlantHeaders }
            storageName="headers"
          />

          <StoreSection
            sectionTitle="Stems"
            plantItems={ PlantBodies }
            storageName="bodies"
          />

          <StoreSection
            sectionTitle="Pots"
            plantItems={ PlantFooters }
            storageName="footers"
          />

        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  pageContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-start',
  },
  scrollContainer: {
    padding: 20,
  },
  shopItem: {
    borderColor: 'red',
    borderWidth: 5,
    padding: 10,
    height: 100,
    width: 100,
  },
});
