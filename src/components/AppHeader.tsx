import * as React from 'react';
import { Text, View } from 'react-native';
import { Header } from "react-native-elements";
import { object } from 'prop-types';

interface IProps {
  title: string;
}

export default class AppHeader extends React.Component<IProps, object> {
  public render() {
    return (
      <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
        <Header
          leftComponent={{ icon: 'menu' }}
          centerComponent={{ text: this.props.title }}
        />
      </View>
    );
  }
}
