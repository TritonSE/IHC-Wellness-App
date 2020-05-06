import * as React from 'react';
import { TextInput, View } from 'react-native';

interface IProps {
  style: object;
  title: string;
  titleColor: string;
  multiline?: boolean;
  autocapital?: 'none' | 'sentences' | 'words' | 'characters';
  underlineColor: string;
  finalText: string; // what user inputted
  onChangeText: (val: string) => void;
}

interface IState {
  finalText: string; // what user inputted
}

class CheckinTextInput extends React.Component<IProps, IState> {

  public static defaultProps = {
    autocapital: 'none',
    multiline: true,
  };

  constructor(props: IProps) {
    super(props);
    this.state = {
      finalText: this.props.finalText,
    };
  }

  // DO I NEED CHANGE METHOD SIMILAR TO THAT OF CHECKINSLIDER COMPONENT

  public render() {
    return (
      <View style={{ paddingTop: 30 }}>
        <TextInput
          style={this.props.style}
          placeholder={this.props.title}
          placeholderTextColor={this.props.titleColor}
          multiline={this.props.multiline}
          autoCapitalize={this.props.autocapital}
          underlineColorAndroid={this.props.underlineColor}
          onChangeText={this.props.onChangeText}
          // value={this.state.finalText} // THIS LINE DIDN'T LET THE USER CHANGE THE TEXT
        />
      </View>
    );
  }
}

export default CheckinTextInput;
