import * as React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { IStoreItem } from '../../../constants/Plants';
import StoreCard from '../../../src/components/Store/StoreCard';

interface IProps {
  readonly plantItems: IStoreItem[];
  readonly storageName: string;
  readonly sectionTitle: string;
}

export default function StoreSection(props: IProps) {
  return (
    <View>
      <Text style={styles.title}>{props.sectionTitle}</Text>
      <FlatList
        horizontal={true}
        data={props.plantItems}
        renderItem={(data: { item: IStoreItem }) => (
          <StoreCard
            name={data.item.name}
            price={data.item.price}
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
