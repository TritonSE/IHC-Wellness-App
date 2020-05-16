import * as React from 'react';
import { Dimensions, Slider, Text, View, StyleSheet } from 'react-native';
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
}

class CheckinSlider extends React.Component<IProps, IState> {

  public static defaultProps = {
    step: 0.01,
  };

  constructor(props: IProps) {
    super(props);
        // this.slider = React.createRef();
    this.state = {
      value: this.props.value,
          // slider: null,
      leftOffset: 0,
      width: 0,
    };
  }

  public componentDidMount() {
        /*this.state.slider.current.measure( (fx, fy, width, height, px, py) => {
            this.setState({
                //slider: React.createRef(),
                width: width,
                leftOffset: px,
            });
        }); */
  }

  public change(value: string) {
    this.setState(() => {
      return {
        value: parseFloat(value),
      };
    });
  }

  public render() {
    const deviceWidth = Dimensions.get('window').width;
    const valuePosition = this.state.leftOffset
                          + this.state.width
                          * (this.state.value / (this.props.maxValue - this.props.minValue));

    return (
        <View style={{ paddingTop: 30 }}>
          <Text>{this.props.title}</Text>
          <Text style={{ width: 50, textAlign: 'center', left: valuePosition }}>
            {Math.floor(this.state.value)}</Text>
          <Slider
            // ref={(slider) => { this.setState({ slider: slider, }) }}
            step={this.props.step}
            minimumValue={this.props.minValue}
            maximumValue={this.props.maxValue}
            value={this.props.value}
            thumbTintColor="#FFFFFF"
            minimumTrackTintColor="#407578"
            onSlidingComplete={this.props.onSlidingComplete}
            onValueChange={(val) => this.setState({ value: val })}
          />
          <View style={sliderStyles.labelContainer}>
            <View style={sliderStyles.minContainer}>
              <Text>{this.props.minValue}</Text>
            </View>
            <View style={sliderStyles.maxContainer}>
              <Text>{this.props.maxValue}</Text>
            </View>
          </View>
        </View>
    );
  }
}

const sliderStyles = StyleSheet.create({
  labelContainer: {
    height: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  minContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  maxContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
})

export default CheckinSlider;
