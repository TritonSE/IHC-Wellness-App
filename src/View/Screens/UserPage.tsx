import * as React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import AppHeader from '../../components/AppHeader';

export interface IProps {
  navigation: any;
}

export default class UserPage extends React.Component<IProps, object> {
  public render() {
    // Hardcoded data for PoC
    const data = [
      { value: 50, date: '2020-4-8' },
      { value: 10, date: '2020-4-9' },
      { value: 40, date: '2020-4-10' },
      { value: 95, date: '2020-4-15' },
      { value: 85, date: '2020-4-23' },
      { value: 91, date: '2020-4-27' },
      { value: 35, date: '2020-5-1' },
      { value: 53, date: '2020-5-6' },
      { value: 24, date: '2020-5-9' },
      { value: 50, date: '2020-5-11' },
    ];

    // Similar to the renderItem method in a FlatList
    const columns = data.map((item, i, arr) => {
      const { value, date } = item;
      const dateDiff = (i === arr.length - 1) ? 0 : this.datesDiff(date, arr[i + 1].date);
      const [year, month, day] = date.split('-');
      const displayDate = `${month}/${day}`;
      return (
        <View key={i}>
          <View
            style={{
              backgroundColor: 'blue',
              height: value,
              marginRight: dateDiff * 20,
              width: 10,
            }}
          >
          </View>
          <Text>{displayDate}</Text>
        </View>
      );
    });

    return (
      <View style={styles.pageView}>
        <AppHeader title="Profile" />

        <Text>Charts go below</Text>

        <ScrollView
          horizontal
          contentContainerStyle={{
            alignItems: 'flex-end', // To keep chart elements at y-bottom
          }}
        >
          {
            columns // Render the JSX in a ScrollView
          }
        </ScrollView>
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

    const [year1, month1, day1] = date1.split('-').map(s => parseInt(s, 10));
    const [year2, month2, day2] = date2.split('-').map(s => parseInt(s, 10));

    const firstDate = new Date(year1, month1, day1).getTime();
    const secondDate = new Date(year2, month2, day2).getTime();

    return Math.round((secondDate - firstDate) / dayLengthInMilliseconds);
  }
}

const styles = StyleSheet.create({
  pageView: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-start',
  },
});
