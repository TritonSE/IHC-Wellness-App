import * as React from 'react';
import { Text, View, TextInput, StyleSheet, ScrollView } from 'react-native';
import { Button } from 'react-native-elements';
//import { ScrollView } from 'react-native-gesture-handler';

import AppHeader from '../../components/AppHeader';
import CheckInSlider from '../../components/CheckInSlider';
import CheckinBackend from '../../Business/CheckinBackend';

interface IState {
  mood: number;
  hoursOfSleep: number;
  happy: number;
  journal: string;
}

export default class CheckInPage extends React.Component<object, IState> {
  constructor(props) {
    super(props);
    this.state = {
      mood: 5,
      hoursOfSleep: 8,
      happy: 1,
      journal: '',
    };
  }

  sendFormInfo = () => {
    let formInfo = Object.assign({}, this.state);
    //console.log(JSON.stringify(formInfo));
    CheckinBackend.saveData(formInfo);
  }

  public render() {
    return (
      <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', borderColor: 'red' }}>
        <AppHeader title="Check-in" />
        <Text>Check In!</Text>
        <ScrollView style={styles.scrollView} >
          <View style={styles.aboveSliders}>
            <CheckInSlider
              title="How are you feeling today"
              step={0.1}
              minValue={0}
              maxValue={10}
              value={this.state.mood}
              onSlidingComplete={(val) => this.setState({ mood: val })}
            />
            <CheckInSlider
              title="How many hours of sleep did you get last night?"
              step={0.1}
              minValue={0}
              maxValue={10}
              value={this.state.hoursOfSleep}
              onSlidingComplete={(val) => this.setState({ hoursOfSleep: val })}
            />
            <CheckInSlider
              title="Are you happy?"
              step={0.001}
              minValue={0}
              maxValue={1}
              value={this.state.happy}
              onSlidingComplete={(val) => this.setState({ happy: val })}
            />
          </View>
          <View style={styles.spacing}>
            <Text  
              style = {styles.headerText}>Journal Entry
            </Text>
            <TextInput
              style={styles.textBox}
              multiline={true}
              underlineColorAndroid="transparent"
              placeholder="Journal Entry"
              placeholderTextColor="#000000"
              autoCapitalize="none"
              onChangeText={(val) => this.setState({ journal: val })}
            />
          </View>
          <View style={styles.spacing}>
            <Button
              title="Submit"
              onPress={this.sendFormInfo}
            />
          </View>
          </ScrollView>  
      </View>
    );
  }
}

const styles = StyleSheet.create({
  aboveSliders: {
    paddingTop: 30,
  },
  spacing: {
    paddingTop: 40,
  },
  textBox: {
    height: 200,
    borderWidth: 2,
  },
  headerText: {
    fontSize: 14,
  },
  scrollView: {

  },
});
