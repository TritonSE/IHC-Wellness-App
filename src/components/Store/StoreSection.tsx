import * as React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { IStoreItem } from 'app/constants/Plants';
import StoreCard from 'app/src/components/Store/StoreCard';

interface IProps {
  plantItems: IStoreItem[];
  storageName: string;
  sectionTitle: string;
}

export default function StoreSection(props: IProps) {
  return (
    <View>
      <Text style={styles.title}>{props.sectionTitle}</Text>
      <FlatList
        horizontal={true}
        data={props.plantItems}
        renderItem={(plant: IStoreItem) => (
            <StoreCard
              name={plant.item.name}
              price={plant.item.price}
              sectionName={props.storageName}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
          />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
  },
});
