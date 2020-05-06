import * as React from 'react';
import { Button, Dimensions, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import CheckinBackend from '../../Business/CheckinBackend';
import AppHeader from '../../components/AppHeader';
import CheckinSlider from '../../components/CheckinSlider';

const { height, width } = Dimensions.get('window');

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

        <ScrollView style={styles.questionScroll}>
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

            <Button
              style={styles.submitButton}
              title="Display"
              onPress={()=> {CheckinBackend.displayAllData()}}
            />

            <Button
              style={styles.submitButton}
              title="Clear"
              onPress={()=> {CheckinBackend.clearAllData()}}
            />

            <Button
              style={styles.submitButton}
              title="Add Question"
              onPress={()=> {CheckinBackend.addQuestion("How?")}}
            />

            <Button
              style={styles.submitButton}
              title="Set Question True"
              onPress={()=> {CheckinBackend.setQuestionUsage("How?", true)}}
            />

            <Button
              style={styles.submitButton}
              title="Set Question False"
              onPress={()=> {CheckinBackend.setQuestionUsage("How?", false)}}
            />

            <Button
              style={styles.submitButton}
              title="Get All Questions"
              onPress={()=> {CheckinBackend.getAllQuestions()}}
            />

            <Button
              style={styles.submitButton}
              title="Get Used Question"
              onPress={()=> {CheckinBackend.getUsedQuestions(true)}}
            />

            <Button
              style={styles.submitButton}
              title="Get Non Used Question"
              onPress={()=> {CheckinBackend.getUsedQuestions(false)}}
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
  // Without this the ScrollView is able to scroll past the header for an unknown reason
  questionScroll: {
    // marginTop: 64,
    width,
  },
  submitButton: {
    paddingTop: 20,
  },
});

export default CheckinPage;
