import * as React from 'react';
import { Text, View, Slider, Dimensions } from 'react-native';
import { Header } from "react-native-elements";
import { object } from 'prop-types';

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
    //slider: any;
    leftOffset: number; 
    width: number;
  }
  
  export default class CheckInSlider extends React.Component<IProps, IState> {

    public static defaultProps = {
        step: 0.01,
    };

    constructor(props) {
        super(props);
        //this.slider = React.createRef();
        this.state = {
          value: this.props.value,
          //slider: null,
          leftOffset: 0,
          width: 0,
        };
    }

    componentDidMount() {
        /*this.state.slider.current.measure( (fx, fy, width, height, px, py) => {
            this.setState({
                //slider: React.createRef(),
                width: width,
                leftOffset: px,
            });
        }); */
    }

    change(value) {
        this.setState(() => {
          return {
            value: parseFloat(value),
          };
        });
    }

    public render() {
      let deviceWidth = Dimensions.get('window').width;
      const valuePosition = ((this.state.value / (this.props.maxValue - this.props.minValue)) * this.state.width) + this.state.leftOffset
     
      return (
        <View style={{ paddingTop: 30 }}>
          <Text>{this.props.title}</Text>
          <Text style={{ width: 50, textAlign: 'center', left: valuePosition }}>
            {Math.floor(this.state.value)}</Text>
          <Slider
            //ref={(slider) => { this.setState({ slider: slider, }) }}
            step={0.1}
            minimumValue={this.props.minValue}
            maximumValue={this.props.maxValue}
            value={this.props.value}
            thumbTintColor='rgb(252, 228, 149)'
            onSlidingComplete={this.props.onSlidingComplete}
            onValueChange={(val) => this.setState({ value: val })}
          />
        </View>
      );
    }
}