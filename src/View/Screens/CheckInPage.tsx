import * as React from 'react';
import { Text, View, Slider, Dimensions, TextInput } from 'react-native';
import AppHeader from '../../components/AppHeader';
import CheckInSlider from '../../components/CheckInSlider';
import { Button } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';

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

  sendFormInfo = () =>{
    let formInfo = Object.assign({}, this.state);
    console.log(JSON.stringify(formInfo));
  }

  public render() {
    return (
      <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', borderColor: 'red'}}>
        <AppHeader title="Check-in" />
        <Text>Check In!</Text>
        <ScrollView> 
        <View style={{ paddingTop: 30 }}>
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
        <View style = {{ paddingTop: 20 }}>
            <TextInput
               style={{height: 40}}
               multiline={true}
               underlineColorAndroid = "transparent"
               placeholder = "Journal Entry"
               placeholderTextColor = "#000000"
               autoCapitalize = "none"
               onChangeText={(val) => this.setState({journal: val})}
               />
        </View>
        <View style={{ paddingTop: 20 }}>
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
