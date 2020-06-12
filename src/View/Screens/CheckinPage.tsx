import * as React from 'react';
import { Alert, Button, Dimensions, FlatList, Modal, SafeAreaView,
         StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { NavigationProp } from '@react-navigation/native';
import { ListItem } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

// TODO replace interface in this file with this import after PoC editing questions is ready
// import { ICheckinQuestion } from '../../../constants/Questions';
import CheckinBackend from '../../Business/CheckinBackend';
import AppHeader from '../../components/AppHeader';
import CheckinSlider from '../../components/CheckinSlider';
import CheckinTextInput from '../../components/CheckinTextInput';

// TODO add a call to addMoney when user submits a checkin
import PlantBackend from '../../Business/PlantBackend';
import StoreBackend from '../../Business/StoreBackend';

const { height, width } = Dimensions.get('window');

// TODO add optional members for sliders, e.g. minValue?: number; maxValue?: number;
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
  toggleModalVisible: boolean;
  addModalVisible: boolean;
  customQuestionText: string;
}

class CheckinPage extends React.Component<IProps, IState> {
  private readonly navigation: NavigationProp<{}> = this.props.navigation;

  private removeEnterListener = this.navigation.addListener('focus', (e) => {
    console.log('TODO: CheckinPage enter, check if user has already checked in');
    // Alert.alert('you have already checked in bud');
  });

  private removeExitListener = this.navigation.addListener('blur', (e) => {
    // console.log('CheckinPage exit, nothing to do here');
  });

  constructor(props: IProps) {
    super(props);
    this.state = {
      addModalVisible: false,
      customQuestionText: '',
      health: 5,
      hoursOfSleep: 8,
      toggleModalVisible: false,
      journal: '',
      mood: 1,
      questions: [{ title: 'how healthy...', key: '0', active: true, type: 'slider' },
                  { title: 'hours of sleep...', key: '1', active: true, type: 'slider' },
                  { title: 'happiness', key: '2', active: true, type: 'slider' },
                  { title: 'journal', key: '3', active: true, type: 'slider' }],
    };
  }

  public componentWillUnmount() {
    console.log('As a screen this component never unmounts, this is a weird scenario');
    this.removeEnterListener();
    this.removeExitListener();
  }

  public sendFormInfo = () => {
    // Object destructuring and spread syntax to separate questions from rest of state object
    const { questions, toggleModalVisible, addModalVisible, customQuestionText,
            ...formData } = this.state;
    console.log(`Saving checkin response ${JSON.stringify(formData)}`);
    CheckinBackend.saveCheckin(formData)
    .then((result) => {
      if (!result) {
        Alert.alert('You have already checked in today');
      }
    });
  }

  public render() {
    return (
      <View style={styles.pageView}>
        <AppHeader title="Check-in" />
        <KeyboardAwareScrollView
          style={styles.screenScroll}
          contentContainerStyle={styles.questionContentContainer}
        >
          <FlatList
            contentContainerStyle={styles.questionWidth}
            data={this.state.questions.filter((q) => q.active)}
            extraData={this.state}
            renderItem={({ item }) => {
              if (item.title === 'how healthy...') {
                return <CheckinSlider
                  title="How healthy are you feeling today?"
                  step={0.1}
                  minValue={0}
                  maxValue={10}
                  value={this.state.health}
                  onSlidingComplete={(val) => this.setState({ health: val })}
                />;
              } else if (item.title === 'hours of sleep...') {
                return <CheckinSlider
                  title="How many hours of sleep did you get last night?"
                  step={0.1}
                  minValue={0}
                  maxValue={10}
                  value={this.state.hoursOfSleep}
                  onSlidingComplete={(val) => this.setState({ hoursOfSleep: val })}
                />;
              } else if (item.title === 'happiness') {
                return <CheckinSlider
                  title="Are you happy?"
                  step={0.01}
                  minValue={0}
                  maxValue={1}
                  value={this.state.mood}
                  onSlidingComplete={(val) => this.setState({ mood: val })}
                />;
              } else if (item.title == 'journal') {
                return <CheckinTextInput
                  style={styles.textInput}
                  title="Journal Entry"
                  titleColor="#000000"
                  multiline={true}
                  autocapital="none"
                  underlineColor="transparent"
                  finalText={this.state.journal}
                  onChangeText={(val) => this.setState({ journal: val })}
                />;
              } else {
                // return <CustomQuestion />;
                return <CheckinTextInput
                  style={styles.textInput}
                  title={item.title}
                  titleColor="black"
                  underlineColor="white"
                  finalText={item.title}
                  onChangeText={(val) => {
                    // TODO no dynamic keys yet
                    // this.setState({customQuestion: val})
                  }}
                />;
              }
            }}
          />

          <Modal visible={this.state.toggleModalVisible} animationType={'fade'} transparent={true}>
            <SafeAreaView style={styles.modalView}>
              <FlatList
                data={this.state.questions}
                extraData={this.state}
                renderItem={({ item, index }) => (
                  <View style={{ padding: 5 }}>
                    <ListItem
                      style={{ width }}
                      title={item.title}
                      rightIcon={
                            (<Ionicons
                              name="md-checkmark-circle"
                              size={32}
                              color={this.state.questions[index].active ? 'green' : 'white'}
                            />)
                      }
                      onPress={() => {
                        this.setState((prevState) => {
                          const { questions: newQuestions } = prevState;
                          const pressedQuestion = newQuestions[index];
                          pressedQuestion.active = !pressedQuestion.active;
                          return { questions: newQuestions };
                        });
                      }}
                    />
                  </View>
                )}
              />
              <Button
                title="Close"
                onPress={() => this.setState({ toggleModalVisible: false })}
              />
            </SafeAreaView>
          </Modal>

          <Modal visible={this.state.addModalVisible} animationType={'fade'} transparent={true}>
            <SafeAreaView style={styles.modalView}>
              <TextInput
                style={{ borderColor: 'black', borderWidth: 1 }}
                placeholder={'Add q here'}
                onChangeText={ (text) => { this.setState({ customQuestionText: text }); } }
              />
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <Button
                  title="Add"
                  onPress={() => {
                    const newQuestion = {
                      title: this.state.customQuestionText,
                      // TODO need a proper key, number should be index not random
                      key: `key${Math.floor(Math.random() * 1000)}`,
                      active: true,
                      type: 'text',
                    };
                    this.setState((prevState) => {
                      return {
                        addModalVisible: false,
                        questions: [...prevState.questions, newQuestion],
                      };
                    });
                  }}
                />
                <Button
                  title="Cancel"
                  onPress={ () => this.setState({ addModalVisible: false })}
                />
              </View>
            </SafeAreaView>
          </Modal>

            <Button
              title="Add Custom Question"
              onPress={() => this.setState({ addModalVisible: true })}
            />

            <Button
              title="Toggle Questions"
              onPress={() => this.setState({ toggleModalVisible: true })}
            />

            <Button
              title="Submit"
              onPress={this.sendFormInfo}
            />

          <Button
            title="check active questions for debugging"
            onPress={() => console.log(this.state.questions.filter((q) => q.active)) }
          />

          <Button
            title="Display"
            onPress={() => { CheckinBackend.displayAllData(); }}
          />

          <Button
            title="Clear"
            onPress={() => { CheckinBackend.clearAllData(); }}
          />

          {/*
            TODO change this to a full page modal, similar to Toggle Questions model
            Modal contents should have a TextInput for question title and 2 buttons:
            Cancel (for closing modal and not adding question, should reset state of TextInput)
            Add (for adding question to this.state.questions, also resets state of TextInput)
          */}
          <Button
            title="Add Question"
            onPress={() => { console.log(CheckinBackend.addQuestion(this.state.questions, 'How?', 'how')); }}
          />

          <Button
            title="Set Question True"
            onPress={() => { CheckinBackend.setQuestionActive('How?', true); }}
          />

          <Button
            title="Set Question False"
            onPress={() => { CheckinBackend.setQuestionActive('How?', false); }}
            />

          <Button
            title="Get All Questions"
            onPress={() => { CheckinBackend.getQuestions(); }}
          />

          <Button
            title="Get Used Question"
            onPress={() => { CheckinBackend.getQuestionsByActive(this.state.questions, true); }}
          />

          <Button
            title="Get Non Used Question"
            onPress={() => { CheckinBackend.getQuestionsByActive(this.state.questions, false); }}
          />
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modalView: {
    height,
    width,
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
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
  textInput: {
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
