import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default interface IProps {
  children: string;
}

export default class Branch extends React.Component<IProps, void> {
  public render() {
    return (
      <View style={styles.branch}>
        <Text style={styles.text}>{this.props.children}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  branch: {
    backgroundColor: '#fff',
    borderRadius: 20,
    minHeight: 333,
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  text: {
    color: '#4A4A4A',
    fontSize: 30,
    marginBottom: 20,
  },
});
