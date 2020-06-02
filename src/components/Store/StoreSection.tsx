import * as React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { IStoreItem } from '../../../constants/Plants';
import StoreCard from '../../../src/components/Store/StoreCard';

interface IProps {
  readonly plantItems: ReadonlyArray<IStoreItem>;
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
        renderItem={({ item }: { item: IStoreItem }) => (
          <StoreCard
            name={item.name}
            price={item.price}
            sectionName={props.storageName}
          />
        )}
        keyExtractor={(_, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
  },
});
