import * as React from 'react';
import {Text, View, AsyncStorage, Slider } from 'react-native';
import { Button } from 'react-native-elements';
import AppHeader from '../../components/AppHeader';
import checkInHelper from '../../Business/checkInBackend.tsx'

export default class CheckInPage extends React.Component<object, object> {
  constructor(props) {
    super(props);
    this.state = {
      mood: 0,
      hoursOfSleep: 0
    };
  }

  public render() {
    const {value} = this.state;
    return (
      <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', borderColor: 'red' }}>
        <AppHeader title="Check-in"/>
        <Text>Check In!</Text>

        <View style={{paddingTop: 30}}>
          <Text>How are you feeling today?</Text>
          <Slider
            step={1}
            minimumValue={1}
            maximumValue={10}
            thumbTintColor='rgb(252, 228, 149)'
            onValueChange={val => this.setState({ mood: val })}
            value={value}
          />

          <Text>How many hours of sleep did you get last night?</Text>
          <Slider
            step={1}
            minimumValue={1}
            maximumValue={10}
            thumbTintColor='rgb(252, 228, 149)'
            onValueChange={val => this.setState({ hoursOfSleep: val })}
            value={value}
          />
        </View>
        <Button
          title="Check In"
          onPress={ ()=>{checkInHelper.saveData(this.state)} }
        />
        <Button
          title="Display"
          onPress={ ()=>{checkInHelper.displayAllData()} }
        />
        <Button
          title="Clear All"
          onPress={ ()=>{checkInHelper.clearAllData()} }
        />
      </View>
    );
  }
}
