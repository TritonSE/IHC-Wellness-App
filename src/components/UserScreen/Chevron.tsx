import { Entypo } from '@expo/vector-icons'; // 6.2.2
import * as React from 'react';
import { Colors } from '../../../constants'

export default class Chevron extends React.Component<object, object> {
  public render() {
    return (
      <Entypo
        name="chevron-right"
        color={Colors.lightGray2}
        containerStyle={{ marginLeft: -15, width: 20 }}
      />
    );
  }
}
