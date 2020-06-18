import * as React from 'react';
import { Slider, StyleSheet, Text, View } from 'react-native';

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
  leftOffset: number;
  width: number;
}

// Values used to track state.value to the slider position
const sliderRadius = 9;
const widthCorrection = 0.87;

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
    };
  }

  public change(value: string) {
    this.setState(() => {
      return {
        value: parseFloat(value),
      };
    });
  }

  public sliderBound(event: any) {
    const { x, width } = event.nativeEvent.layout;
    this.setState({
      width,
      leftOffset: x,
    });
  }

  public render() {
    const valuePosition = this.state.leftOffset - sliderRadius
                          + this.state.width * widthCorrection
                          * ((this.state.value - this.props.minValue)
                            / (this.props.maxValue - this.props.minValue));

    return (
        <View style={styles.container}
          onLayout={(event) => this.sliderBound(event) }
        >
          <Text>{this.props.title}</Text>
          <Text style={{ width: 50, textAlign: 'center', left: valuePosition }}>
            {Math.floor(this.state.value)}</Text>
          <Slider
            step={this.props.step}
            minimumValue={this.props.minValue}
            maximumValue={this.props.maxValue}
            value={this.props.value}
            thumbTintColor="rgb(252, 228, 149)"
            onSlidingComplete={this.props.onSlidingComplete}
            onValueChange={(val) => this.setState({ value: val })}
          />
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
  },
});

export default CheckinSlider;
