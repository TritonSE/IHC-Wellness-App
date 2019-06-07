import * as React from 'react';
import { Text, View } from 'react-native';

export default class CheckInPage extends React.Component<object, object> {
  public render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Check In!</Text>
        <Text>Be Happy!</Text>
      </View>
    );
  }
}
