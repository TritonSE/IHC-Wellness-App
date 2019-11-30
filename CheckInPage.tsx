import * as React from 'react';
import {Text, View, AsyncStorage } from 'react-native';
import { Button } from 'react-native-elements';
import AppHeader from '../../components/AppHeader';
import checkInHelper from '../../Business/checkInBackend.tsx'

export default class CheckInPage extends React.Component<object, object> {
  constructor(props) {
    super(props);
    this.state = {
        sleepHours: "10",
        mood: "happy"
    };

    handleSleepHours = (hours) => {
      this.setState({ sleepHours: hours });
    };
    handleMood = (feeling) => {
      this.setState({ mood: feeling });
    };
  }


  public render() {
    return (
      <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
        <AppHeader title="Check-in"/>
        <Text>Check In!</Text>
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
        <Text>Be Happy!</Text>
      </View>
    );
  }
}
