import * as React from 'react';
import { Alert, Button, Dimensions, FlatList, Modal,
         SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { NavigationProp } from '@react-navigation/native';
import { ListItem } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { CheckinType, getCheckinType, ICheckinQuestion, ICheckinSlider, ICheckinText } from '../../../constants/Questions';
import CheckinBackend from '../../Business/CheckinBackend';
import { isUserCheckedIn } from '../../Business/ProfileBackend';
import StoreBackend from '../../Business/StoreBackend';
import AppHeader from '../../components/AppHeader';
import CheckinSlider from '../../components/CheckinSlider';
import CheckinTextInput from '../../components/CheckinTextInput';

const { height, width } = Dimensions.get('window');

interface IProps {
  navigation: NavigationProp<{}>;
}

interface IState {
  questions: ICheckinQuestion[];
  toggleModalVisible: boolean;
  addModalVisible: boolean;
  customQuestionText: string;
}

const CHECKIN_REWARD: number = 4.00;

class CheckinPage extends React.Component<IProps, IState> {
  private readonly navigation: NavigationProp<{}> = this.props.navigation;
  private storeController: StoreBackend = StoreBackend.getInstance();

  private removeEnterListener = this.navigation.addListener('focus', (e) => {
    isUserCheckedIn()
    .then((userCheckedIn: boolean) => {
      if (userCheckedIn) Alert.alert('You have already checked in today');
    });
  });

  private removeExitListener = this.navigation.addListener('blur', (e) => {
    // console.log('CheckinPage exit, nothing to do here');
  });

  constructor(props: IProps) {
    super(props);

    this.state = {
      questions: [{ title: 'Loading...', key: '0', active: true }],
      customQuestionText: '',
      addModalVisible: false,
      toggleModalVisible: false,
    };

    CheckinBackend.getQuestions()
    .then((questions: ICheckinQuestion[]) => {
      const dynamicKeys: any = {};
      for (const question of questions) {
        switch (getCheckinType(question)) {
          case CheckinType.slider:
            dynamicKeys[question.key] = (question as ICheckinSlider).minValue;
          case CheckinType.text:
            dynamicKeys[question.key] = '';
        }
      }
      this.setState(() => ({ questions, ...dynamicKeys }));
    });
  }

  public componentWillUnmount() {
    console.log('As a screen this component never unmounts, this is a weird scenario');
    this.removeEnterListener();
    this.removeExitListener();
  }

  public sendFormInfo = () => {
    const responseKeys = this.state.questions
                         .filter((q) => q.active)
                         .map((q) => [getCheckinType(q), q.key, 'minValue' in q ? q.minValue : '']);
    const responses: any = {};
    for (const [checkinType, key, defaultVal] of responseKeys) {
      let responseVal = this.state[key];
      if (checkinType === CheckinType.slider && responseVal === '') responseVal = defaultVal;
      responses[key] = responseVal;
    }
    console.log(`Saving checkin response ${JSON.stringify(responses)}`);
    CheckinBackend.saveCheckin(responses);
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
              switch (getCheckinType(item)) {
                case CheckinType.slider:
                  const slider = item as ICheckinSlider;
                  return (
                    <CheckinSlider
                      title={slider.title}
                      step={slider.step}
                      minValue={slider.minValue}
                      maxValue={slider.maxValue}
                      value={this.state[slider.key] || slider.minValue}
                      onSlidingComplete={(val) => this.setState({ [slider.key]: val })}
                    />
                  );
                case CheckinType.text:
                  const text = item as ICheckinText;
                  return (
                    <CheckinTextInput
                      style={styles.textInput}
                      title={text.title}
                      titleColor="#000000"
                      multiline={true}
                      autocapital="none"
                      underlineColor="transparent"
                      finalText={this.state[text.key]}
                      onChangeText={(val) => this.setState({ [text.key]: val })}
                    />
                  );
                default:
                  throw new Error('Data passed to FlatList is not a valid CheckinType');
              }
            }}
          />

          {/* Full-page modal for toggling which questions are active */}
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
                onPress={() => {
                  CheckinBackend.setQuestions(this.state.questions);
                  this.setState({ toggleModalVisible: false });
                }}
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
                    const newDynamicKey = `key${Math.floor(Math.random() * 1000000)}`;
                    const newQuestion: ICheckinText = {
                      title: this.state.customQuestionText,
                      // TODO need a proper key, number should be index not random
                      key: newDynamicKey,
                      active: true,
                    };
                    this.setState((prevState) => {
                      const newQuestions = [...prevState.questions, newQuestion];
                      CheckinBackend.setQuestions(newQuestions);
                      return {
                        addModalVisible: false,
                        [newDynamicKey]: '',
                        questions: newQuestions,
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
            title="Submit"
            onPress={() => {
              // TODO check if form has already been submitted
              this.sendFormInfo();
              this.storeController.addMoney(CHECKIN_REWARD);
            }}
          />

          <Button
            title="Add Custom Question"
            onPress={() => this.setState({ addModalVisible: true })}
          />

          <Button
            title="Toggle Questions"
            onPress={() => {
              this.setState({ toggleModalVisible: true });
              CheckinBackend.setQuestions(this.state.questions);
            }}
          />

          <Text>Debug buttons go below</Text>

          <Button
            title="Clear all async data"
            onPress={() => { CheckinBackend.clearAllData(); }}
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
