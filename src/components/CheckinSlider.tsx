import * as React from 'react';
import { Dimensions, Slider, Text, View } from 'react-native';
import { Header } from 'react-native-elements';

interface IProps {
  title: string;
  step?: number;
  minValue: number;
  maxValue: number;
  value: number;
  onSlidingComplete: (val: number) => void;
}

interface IState {
  value: number;
    // slider: any;
  leftOffset: number;
  width: number;
  leftOff: number;
}

// Values used to track state.value to the slider position
const deviceWidth = Dimensions.get('window').width;
const sliderRadius = 9;
const widthCorrection = 0.88;

class CheckinSlider extends React.Component<IProps, IState> {

  public static defaultProps = {
    step: 0.01,
  };

  constructor(props: IProps) {
    super(props);

    this.state = {
      leftOffset: 0,
      value: this.props.value,
      width: 0,
      leftOff: 0,
    };
  }

  public change(value: string) {
    this.setState(() => {
      return {
        value: parseFloat(value),
      };
    });
  }

  public slider_bound=(event: any)=>{
    const {x, y, width, height} = event.nativeEvent.layout;
    this.setState({width: width})
    }

  public render() {
    const valuePosition = this.state.leftOffset - sliderRadius
                          + this.state.width * widthCorrection
                          * (this.state.value / (this.props.maxValue - this.props.minValue));

    return (
        <View style={{ paddingTop: 30 }}
          onLayout={(event) => {
            let { x, y, width, height } = event.nativeEvent.layout;
            this.setState({
              leftOffset: x,
              width: width,
            });
          }}
        >
          <Text>{this.props.title}</Text>
          <Text style={{ width: 50, textAlign: 'center', left: this.state.leftOff}}>
            {Math.floor(this.state.value)}</Text>
          <Slider
            // ref={(slider) => { this.setState({ slider: slider, }) }}
            step={this.props.step}
            minimumValue={this.props.minValue}
            maximumValue={this.props.maxValue}
            value={this.props.value}
            thumbTintColor="rgb(252, 228, 149)"
            onSlidingComplete={this.props.onSlidingComplete}
            onValueChange={(val) => this.setState({ value: val, leftOff: valuePosition })}
            onLayout={(event)=>{this.slider_bound(event)}}
          />
        </View>
    );
  }
}

export default CheckinSlider;
