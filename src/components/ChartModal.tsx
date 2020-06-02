import * as React from 'react';
import { Dimensions, Modal, ScrollView, StyleSheet, Text, TouchableHighlight, View } from 'react-native';

export interface IQueryDataPoint {
  date: string;
  value: number;
}

interface IProps {
  modalTitle: string;
  data: ReadonlyArray<IQueryDataPoint>;
  exitText?: string;
}

interface IState {
  modalVisible: boolean;
}

const MAX_HEIGHT = 100;
const deviceWidth = Dimensions.get('window').width;

class ChartModal extends React.Component<IProps, IState>  {
  private graph: ScrollView | null = null;
  private readonly columns: Element[] | null = null;
  private readonly maxValue: number;

  public static defaultProps = {
    exitText: 'Close',
  };

  constructor(props: IProps) {
    super(props);
    this.state = {
      modalVisible: false,
    };

    this.maxValue = Math.max.apply(Math, this.props.data.map((e) => e.value));

    // Similar to the renderItem method in a FlatList
    this.columns = this.props.data.map((item, i, arr) => {
      const { value, date } = item;
      const dateDiff = (i === arr.length - 1) ? 0 : this.datesDiff(date, arr[i + 1].date);
      const [year, month, day] = date.split('-');
      const displayDate = `${month}/${day}`;
      return (
        <View key={i}>
          <View
            style={{
              backgroundColor: 'blue',
              height: MAX_HEIGHT * (value / this.maxValue),
              marginRight: dateDiff * 20,
              width: 10,
            }}
          >
          </View>
          <Text>{displayDate}</Text>
        </View>
      );
    });
  }

  public setModalVisible = (visible: boolean) => {
    this.setState({ modalVisible: visible });
  }

  public render() {
    const { modalVisible } = this.state;

    return (
        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.modalVisible}
            onShow={() => this.graph?.scrollToEnd({ animated: false })}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.titleText}>{this.props.modalTitle}</Text>
                <View style={styles.graphArea}>
                <View style={styles.graphLegend}>
                    <Text>{this.maxValue}-</Text>
                    <Text>0-</Text>
                  </View>
                  <ScrollView
                    horizontal
                    contentContainerStyle={{
                      alignItems: 'flex-end', // To keep chart elements at y-bottom
                    }}
                    ref={(r) => this.graph = r}
                    >
                    {
                      this.columns // Render the JSX in a ScrollView
                    }
                  </ScrollView>
                  <View style={styles.graphLegend}>
                    <Text>-{this.maxValue}</Text>
                    <Text>-0</Text>
                  </View>
                </View>
                <TouchableHighlight
                  style={{ ...styles.openButton, backgroundColor: '#2196F3', marginTop: 20 }}
                  onPress={() => this.setModalVisible(!modalVisible)}
                >
                  <Text style={styles.textStyle}>{this.props.exitText}</Text>
                </TouchableHighlight>
              </View>
            </View>
          </Modal>

          <TouchableHighlight
            style={styles.openButton}
            onPress={() => {
              this.setModalVisible(true);
            }}
          >
            <Text style={styles.textStyle}>
              {this.props.modalTitle}
            </Text>
          </TouchableHighlight>
        </View>
    );
  }

  /**
   * Returns the difference in days between dates in 'YYYY-MM-DD' format
   * @param date1 First date, earlier than or same as second date
   * @param date2 Second date, later than or same as first date
   */
  private datesDiff(date1: string, date2: string) {
    const dayLengthInMilliseconds = 24 * 60 * 60 * 1000;

    const [year1, month1, day1] = date1.split('-').map((s) => parseInt(s, 10));
    const [year2, month2, day2] = date2.split('-').map((s) => parseInt(s, 10));

    const firstDate = new Date(year1, month1, day1).getTime();
    const secondDate = new Date(year2, month2, day2).getTime();

    return Math.round((secondDate - firstDate) / dayLengthInMilliseconds);
  }
}

export default ChartModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  graphArea: {
    flexDirection: 'row',
  },
  graphLegend: {
    alignItems: 'center',
    flexDirection: 'column',
    height: MAX_HEIGHT * 1.1,
    justifyContent: 'space-between',
  },
  modalView: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    elevation: 5,
    justifyContent: 'space-between',
    margin: 0,
    padding: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    height: deviceWidth * 3 / 4,
    width: deviceWidth,
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  titleText: {
  },
});
