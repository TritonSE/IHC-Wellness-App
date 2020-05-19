import * as React from 'react';
import { Dimensions, Slider, Text, View, TextInput } from 'react-native';
import { Header } from 'react-native-elements';
import CheckinTextInput from './CheckinTextInput'

interface IProps {
}

interface IState{
  customQuestion: string,
  customInput: string
}

export default class CustomQuestion extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);

    this.state = {
      customQuestion: 'Enter your question here!',
      customInput: 'Enter your answer here!'
    };
  }

  // why have underline color?
  public render() {
    return (
      <View>
        <CheckinTextInput
          style={{borderWidth: 2}}
          title={this.state.customQuestion}
          titleColor="black"
          underlineColor="white"
          finalText={this.state.customQuestion}
          onChangeText={(val)=>this.setState({customQuestion: val})}
        />
      </View>
      
    );
  }

}
