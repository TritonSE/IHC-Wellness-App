import * as React from 'react';
import {  Dimensions, ScrollView, StyleSheet, TextInput, View, Text } from 'react-native';

//extra styling
import { Button } from 'react-native-elements';

import CheckinBackend from '../../Business/CheckinBackend';
import AppHeader from '../../components/AppHeader';
import CheckinSlider from '../../components/CheckinSlider';``
import NavAbsolute from '../Navigations/NavAbsolute';

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

            <Text style={styles.header}>What's New?</Text>
            <Text style={styles.subheader}>Your Daily check-in</Text>

            <View style={styles.questionBackground}>
              <CheckinSlider
                title="How healthy are you feeling today?"
                step={0.1}
                minValue={0}
                maxValue={10}
                value={this.state.health}
                onSlidingComplete={(val) => this.setState({ health: val })}
              />
            </View>

            <View style={styles.questionBackground}>
              <CheckinSlider
                title="How many hours of sleep did you get last night?"
                step={0.1}
                minValue={0}
                maxValue={10}
                value={this.state.hoursOfSleep}
                onSlidingComplete={(val) => this.setState({ hoursOfSleep: val })}
              />
            </View>

            <View style={styles.questionBackground}>
              <CheckinSlider
                title="Are you happy?"
                step={1}
                minValue={0}
                maxValue={1}
                value={this.state.mood}
                onSlidingComplete={(val) => this.setState({ mood: val })}
              />
            </View>

            <View style={styles.questionBackground}>
              <Text style={styles.questionText}>What is one thing you feel grateful for today?</Text>
              <View style={[styles.freeResponse, {height: 60}]}>
                <TextInput
                  multiline={true}
                  underlineColorAndroid = "transparent"
                  placeholder = "Journal Entry"
                  placeholderTextColor = "#B5B5B5"
                  autoCapitalize = "none"
                  onChangeText={(val) => this.setState({ journal: val })}
                  />
                </View>
            </View>

            <View style={styles.questionBackground}>
              <Text style={styles.questionText}>What are three things you accomplished today?</Text>
              <View style={[styles.freeResponse, {height: 30, marginBottom: 10}]}>
                <TextInput
                  multiline={true}
                  underlineColorAndroid = "transparent"
                  placeholder = "I finished..."
                  placeholderTextColor = "#B5B5B5"
                  autoCapitalize = "none"
                  onChangeText={(val) => this.setState({ journal: val })}
                  />
                </View>
                <View style={[styles.freeResponse, {height: 30, marginBottom: 10}]}>
                <TextInput
                  multiline={true}
                  underlineColorAndroid = "transparent"
                  placeholder = "I learned..."
                  placeholderTextColor = "#B5B5B5"
                  autoCapitalize = "none"
                  onChangeText={(val) => this.setState({ journal: val })}
                  />
                </View>
                <View style={[styles.freeResponse, {height: 30}]}>
                <TextInput
                  multiline={true}
                  underlineColorAndroid = "transparent"
                  placeholder = "I did..."
                  placeholderTextColor = "#B5B5B5"
                  autoCapitalize = "none"
                  onChangeText={(val) => this.setState({ journal: val })}
                  />
                </View>
            </View>

            <Button
              buttonStyle={styles.submitButton}
              title="Submit"
              onPress={this.sendFormInfo}
            />

            <Button
              buttonStyle={styles.submitButton}
              title="Display"
              onPress={()=> {CheckinBackend.displayAllData()}}
            />

            <Button
              buttonStyle={styles.submitButton}
              title="Clear"
              onPress={()=> {CheckinBackend.clearAllData()}}
            />

            <Button
              buttonStyle={styles.submitButton}
              title="Add Question"
              onPress={()=> {CheckinBackend.addQuestion("How?")}}
            />

            <Button
              buttonStyle={styles.submitButton}
              title="Set Question True"
              onPress={()=> {CheckinBackend.setQuestionUsage("How?", true)}}
            />

            <Button
              buttonStyle={styles.submitButton}
              title="Set Question False"
              onPress={()=> {CheckinBackend.setQuestionUsage("How?", false)}}
            />

            <Button
              buttonStyle={styles.submitButton}
              title="Get All Questions"
              onPress={()=> {CheckinBackend.getAllQuestions()}}
            />

            <Button
              buttonStyle={styles.submitButton}
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
  header: {
    fontSize: 36,
    marginLeft: 20,
    marginBottom: 6,
  },
  subheader: {
    fontSize: 16,
    marginLeft: 20,
    marginBottom: 20,
  },
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
    backgroundColor: "#407578",
    borderRadius: 10,
    width: 335,
    height: 42,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 20,
  },
  questionBackground: {
    width: 335,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowColor: 'rgb(236, 236, 236)',
    shadowOpacity: 25,
    shadowRadius: 5,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 16,
    paddingLeft: 12,
    paddingRight: 12,
    paddingBottom: 12,
  },
  questionText: {
    fontSize: 16,
    marginTop: 15,
    marginBottom: 15,
  },
  freeResponse: {
    width: 310,
    backgroundColor: 'white',
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#F1F1F1',
    paddingLeft: 10,
    paddingTop: 5,
    paddingBottom: 5,
  },
});

export default CheckinPage;
