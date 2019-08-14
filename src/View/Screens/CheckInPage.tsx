import * as React from 'react';
import { Text, View } from 'react-native';
import AppHeader from '../../components/AppHeader';

export default class CheckInPage extends React.Component<object, object> {
  public render() {
    return (
      <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
        <AppHeader title="Check-in"/>
        <Text>Check In!</Text>
        <Text>Be Happy!</Text>
      </View>
    );
  }
}
