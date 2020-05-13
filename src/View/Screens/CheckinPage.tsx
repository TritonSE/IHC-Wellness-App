import * as React from 'react';
import { Alert, Button, Dimensions, FlatList, ScrollView, StyleSheet, View } from 'react-native';

import { NavigationProp } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ModalDropdown from 'react-native-modal-dropdown';

// TODO replace interface in this file with this import after PoC editing questions is ready
// import { ICheckinQuestion } from '../../../constants/Questions';
import CheckinBackend from '../../Business/CheckinBackend';
import AppHeader from '../../components/AppHeader';
import CheckinSlider from '../../components/CheckinSlider';
import CheckinTextInput from '../../components/CheckinTextInput';
import CustomQuestion from '../../components/CustomQuestion';

const width = Dimensions.get('window').width;

interface ICheckinQuestion {
  title: string;
  key: string;
  active: boolean;
  type: 'slider' | 'text';
}

interface IProps {
  navigation: NavigationProp<{}>;
}

interface IState {
  health: number;
  hoursOfSleep: number;
  mood: number;
  journal: string;
  questions: ICheckinQuestion[];
}

class CheckinPage extends React.Component<IProps, IState> {
  private readonly navigation: NavigationProp<{}> = this.props.navigation;

  private removeEnterListener = this.navigation.addListener('focus', (e) => {
    console.log('TODO: CheckinPage enter, check if user has already checked in');
    Alert.alert('you have already checked in bud');
  });

  private removeExitListener = this.navigation.addListener('blur', (e) => {
    console.log('CheckinPage exit, nothing to do here');
  });

  constructor(props: IProps) {
    super(props);
    this.state = {
      health: 5,
      hoursOfSleep: 8,
      mood: 1,
      journal: '',
      questions: []
    };
  }

  public componentWillUnmount() {
    console.log('As a screen this component never unmounts, this is a weird scenario');
    this.removeEnterListener();
    this.removeExitListener();
  }

  public sendFormInfo() {
    const formInfo = Object.assign({}, this.state);
    console.log(`Saving checkin response ${JSON.stringify(formInfo)}`);
    CheckinBackend.saveData(formInfo);
  }

  public dropDownSelect(idx, value) {
    // method removed during merge, remake
  }

  // TODO render active ICheckinQuestions in a FlatList
  public render() {
    return (
      <View style={styles.pageView}>
        <AppHeader title="Check-in" />
        <KeyboardAwareScrollView
          style={styles.screenScroll}
          contentContainerStyle={styles.questionContentContainer}
        >
          {/* TODO: Replace with FlatList, same style but in contentContainerStyle prop */}
          <ScrollView style={styles.questionWidth}>
          <ModalDropdown 
                options={this.state.questions}
                onSelect = {(idx, value) => this.dropDownOnSelect(idx, value)}
          />

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
                step={0.01}
                minValue={0}
                maxValue={1}
                value={this.state.mood}
                onSlidingComplete={(val) => this.setState({ mood: val })}
              />

              <CheckinTextInput 
                style={styles.textInputs}
                title="Journal Entry"
                titleColor="#000000"
                multiline={true}
                autocapital="none"
                underlineColor="transparent"
                finalText={this.state.journal}
                onChangeText={(val) => this.setState({ journal: val })}
              />

              <CustomQuestion />

              <Button
                title="Add Custom Question"
                onPress={()=>{this.state.questions.push('new custom question')}}
              />

              <Button
                title="Submit"
                onPress={this.sendFormInfo}
              />

            <CheckinTextInput
              style={styles.textInputs}
              title="Journal Entry"
              titleColor="#000000"
              multiline={true}
              autocapital="none"
              underlineColor="transparent"
              finalText={this.state.journal}
              onChangeText={(val) => this.setState({ journal: val })}
            />

            <Button
              title="Submit"
              onPress={this.sendFormInfo}
            />

            <Button
              title="Display"
              onPress={() => { CheckinBackend.displayAllData(); }}
            />

            <Button
              title="Clear"
              onPress={() => { CheckinBackend.clearAllData(); }}
            />

            <Button
              title="Add Question"
              onPress={() => { CheckinBackend.addQuestion('How?', 'how'); }}
            />

            <Button
              title="Set Question True"
              onPress={() => { CheckinBackend.setQuestionUsage('How?', true); }}
            />

            <Button
              title="Set Question False"
              onPress={() => { CheckinBackend.setQuestionUsage('How?', false); }}
              />

            <Button
              title="Get All Questions"
              onPress={() => { CheckinBackend.getAllQuestions(); }}
            />

            <Button
              title="Get Used Question"
              onPress={() => { CheckinBackend.getUsedQuestions(true); }}
            />

            <Button
              title="Get Non Used Question"
              onPress={() => { CheckinBackend.getUsedQuestions(false); }}
            />
          </ScrollView>
        </KeyboardAwareScrollView>
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
    // borderWidth: 2,
  },
  questionContentContainer: {
    alignItems: 'center',
  },
  questionWidth: {
    width: width * 0.8,
  },
  screenScroll: {
    width,
  },
  submitButton: {
    paddingTop: 20,
  },
  textInputs: {
    height: 100, // For dimensions
    borderRadius: 2, // How round is the text box
    borderWidth: 2, // Set border width.
    borderColor: '#000000', // Set border Hex Color Code Here
    color: '#000000', // Setting up Text Font Color.
    backgroundColor : '#FFFFFF', // Setting Up Background Color of Text component.
    padding : 2, // Adding padding on Text component.
    fontSize: 14,
    // textAlign: 'center',
    margin: 10,
  },
  keyboard: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    borderColor: 'red',
    borderWidth: 2,
  },
});

export default CheckinPage;
