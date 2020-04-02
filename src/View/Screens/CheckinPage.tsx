import * as React from 'react';
import { Dimensions, Slider, Text, TextInput, View } from 'react-native';
import { Button } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';

import AppHeader from '../../components/AppHeader';
import CheckinSlider from '../../components/CheckinSlider';

import CheckinBackend from '../../Business/CheckinBackend';

interface IProps {}

interface IState {
  mood: number;
  hoursOfSleep: number;
  happy: number;
  journal: string;
}

export default class CheckInPage extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      mood: 5,
      hoursOfSleep: 8,
      happy: 1,
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
      <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', borderColor: 'red' }}>
        <AppHeader title="Check-in" />
        <Text>Check In!</Text>
        <ScrollView>
        <View style={{ paddingTop: 30 }}>
          <CheckinSlider
            title="How are you feeling today"
            step={0.1}
            minValue={0}
            maxValue={10}
            value={this.state.mood}
            onSlidingComplete={(val) => this.setState({ mood: val })}
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
            step={0.001}
            minValue={0}
            maxValue={1}
            value={this.state.happy}
            onSlidingComplete={(val) => this.setState({ happy: val })}
            />
        </View>

        <View style = {{ paddingTop: 20 }}>
            <TextInput
               style={{ height: 40 }}
               multiline={true}
               underlineColorAndroid = "transparent"
               placeholder = "Journal Entry"
               placeholderTextColor = "#000000"
               autoCapitalize = "none"
               onChangeText={(val) => this.setState({ journal: val })}
               />
        </View>
        <View style={{ paddingTop: 20 }}>
          <Button
            title="Submit"
            onPress={this.sendFormInfo}
            />
        </View>

        <Button
          title="Display"
          onPress={ () => { CheckinBackend.displayAllData(); } }
        />
        <Button
          title="Clear All"
          onPress={ () => { CheckinBackend.clearAllData(); } }
        />

        </ScrollView>
      </View>
    );
  }
}
