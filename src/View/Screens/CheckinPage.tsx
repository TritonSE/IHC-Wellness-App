import * as React from 'react';
import { Button, Dimensions, FlatList, Modal, ScrollView, StyleSheet, Text, TouchableOpacity  , View, SafeAreaView } from 'react-native';

import { NavigationProp } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ModalDropdown from 'react-native-modal-dropdown';

import CheckinBackend from '../../Business/CheckinBackend';
import AppHeader from '../../components/AppHeader';
import CheckinSlider from '../../components/CheckinSlider';
import CheckinTextInput from '../../components/CheckinTextInput';
import CustomQuestion from '../../components/CustomQuestion';

const { height, width } = Dimensions.get('window');

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
  isVisible: boolean;
}

class CheckinPage extends React.Component<IProps, IState> {
  private readonly navigation: NavigationProp<{}> = this.props.navigation;

  private removeEnterListener = this.navigation.addListener('focus', (e) => {
    console.log('TODO: CheckinPage enter, check if user has already checked in');
  });

  private removeExitListener = this.navigation.addListener('blur', (e) => {
    console.log('CheckinPage exit, nothing to do here');
  });

  constructor(props: IProps) {
    super(props);
    this.state = {
      health: 5,
      hoursOfSleep: 8,
      isVisible: false,
      journal: '',
      mood: 1,
      questions: [{ title: 'how healthy...', key: '0', active: true, type: 'slider' },
                  { title: 'hours of sleep...', key: '1', active: true, type: 'slider' },
                  { title: 'happiness', key: '2', active: true, type: 'slider' },
                  { title: 'journal', key: '3', active: true, type: 'slider' },
                  { title: 'custom q', key: 'placeholder custom q', active: true, type: 'slider' }],
    };
  }

  /* 
  /* for filtering, but makes ts lint angry as is due to ordering
  private filter () {
    for(let i = this.state.questions.length; i >= 0; i--) {
      if(!this.state.questions[i].active) {
        console.log('removing');
      }
    }
  } */

  public componentWillUnmount() {
    console.log('As a screen this component never unmounts, this is a weird scenario');
    this.removeEnterListener();
    this.removeExitListener();
  }

  public sendFormInfo = () => {
    const formInfo = Object.assign({}, this.state);
    console.log(`Saving checkin response ${JSON.stringify(formInfo)}`);
    CheckinBackend.saveData(formInfo);
  }

  // TODO: KeyboardAvoidingView did not work
  // Will probably want to use react-native-keyboard-aware-scroll-view instead
  public render() {
    return (
      <View style={styles.pageView}>
        <AppHeader title="Check-in" />
        <KeyboardAwareScrollView
          style={styles.screenScroll}
          contentContainerStyle={styles.questionContentContainer}
        >
          {/* TODO: Replace with FlatList, same style but dynamic content */}
          <ScrollView style={styles.questionWidth}>

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
                onPress={() => {this.state.questions.push({ title: 'test', key: 'key', active: true, type: 'text' }); }}
              />

              <Button
                title="Submit"
                onPress={this.sendFormInfo}
              />

            <Modal visible={this.state.isVisible} animationType={'fade'} transparent={true}>
              <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff', margin: 25 }}>
                <FlatList
                  data={this.state.questions}
                  renderItem={({ item, index, separators }) => (
                    <View style={{padding: 5}}>
                      <TouchableOpacity
                        onPress={ () => console.log('pressed')}
                      >
                        <Text>Press me: {item.title}</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                />
                <Button
                  title="hide modal"
                  onPress={() => this.setState({ isVisible: false })}
                />
              </SafeAreaView>
            </Modal>

            <Button
              title="Toggle Questions"
              onPress={() => this.setState({ isVisible: true })}
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
