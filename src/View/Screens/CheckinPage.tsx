import * as React from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';

import AppHeader from '../../components/AppHeader';
import CheckinSlider from '../../components/CheckinSlider';

import CheckinBackend from '../../Business/CheckinBackend';

interface IState {
  health: number;
  hoursOfSleep: number;
  mood: number;
  journal: string;
}

class CheckinPage extends React.Component<object, IState> {
  constructor(props: object) {
    super(props);
    this.state = {
      health: 5,
      hoursOfSleep: 8,
      mood: 1,
      journal: '',
    };
  }

  public sendFormInfo = () => {
    const formInfo = Object.assign({}, this.state);
    console.log(JSON.stringify(formInfo));
    CheckinBackend.saveData(formInfo);
  }

  public render() {
    return (
      <View style={styles.pageView}>
        <AppHeader title="Check-in" />

        <ScrollView style={styles.questions}>
            <CheckinSlider
              title="How healthy are you feeling today?"
              step={0.1}
              minValue={0}
              maxValue={10}
              value={this.state.health}
              onSlidingComplete={(val) => this.setState({ health: val })}
            />

            <CheckinSlider
              title="How many hours of sleep did you get last night?"
              step={0.1}
              minValue={0}
              maxValue={10}
              value={this.state.hoursOfSleep}
              onSlidingComplete={(val) => this.setState({ hoursOfSleep: val })}
            />

            <CheckinSlider
              title="Are you happy?"
              step={1}
              minValue={0}
              maxValue={1}
              value={this.state.mood}
              onSlidingComplete={(val) => this.setState({ mood: val })}
            />

            <TextInput
              style={{ height: 40 }}
              multiline={true}
              underlineColorAndroid = "transparent"
              placeholder = "Journal Entry"
              placeholderTextColor = "#000000"
              autoCapitalize = "none"
              onChangeText={(val) => this.setState({ journal: val })}
              />

            <Button
              style={styles.submitButton}
              title="Submit"
              onPress={this.sendFormInfo}
            />

        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  pageView: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-start',
    // borderColor: 'red',
  },
  questions: {
    marginTop: 64,
  },
  submitButton: {
    paddingTop: 20,
  },
});

export default CheckinPage;
