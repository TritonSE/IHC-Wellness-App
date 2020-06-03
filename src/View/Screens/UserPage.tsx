import * as React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { NavigationProp } from '@react-navigation/native';

import { retrievePreviousCheckins } from '../../Business/ProfileBackend';
import AppHeader from '../../components/AppHeader';
import ChartModal, { IQueryDataPoint } from '../../components/ChartModal';

interface IProps {
  navigation: NavigationProp<{}>;
}

export default class UserPage extends React.Component<IProps, object> {
  public constructor(props: IProps) {
    super(props);

    retrievePreviousCheckins(30)
      .then((value) => {
        // TODO use value in here
        console.log(JSON.stringify(value));
      })
      // TODO add example catch code, talk about enter listener
      .catch();
  }

  public render() {
    const healthData: ReadonlyArray<IQueryDataPoint> = [
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

    const moodData: ReadonlyArray<IQueryDataPoint> = [
      { value: 10, date: '2020-4-1' },
      { value: 1, date: '2020-4-5' },
      { value: 5, date: '2020-4-10' },
      { value: 8, date: '2020-4-15' },
      { value: 3, date: '2020-4-21' },
      { value: 4, date: '2020-4-25' },
      { value: 7, date: '2020-5-1' },
      { value: 2, date: '2020-5-9' },
      { value: 6, date: '2020-5-10' },
      { value: 10, date: '2020-5-11' },
    ];

    const sleepData: ReadonlyArray<IQueryDataPoint> = [
      { value: 10, date: '2020-4-1' },
      { value: 1, date: '2020-4-5' },
      { value: 5, date: '2020-4-10' },
      { value: 8, date: '2020-4-15' },
      { value: 3, date: '2020-4-21' },
      { value: 4, date: '2020-4-25' },
      { value: 7, date: '2020-5-1' },
      { value: 2, date: '2020-5-6' },
      { value: 6, date: '2020-5-8' },
      { value: 10, date: '2020-5-11' },
    ];

    return (
     <View style={styles.pageView}>
       <AppHeader title="Profile"/>
       <ScrollView>
          <ChartModal
            modalTitle="Health Data"
            data={healthData}
          />

          <ChartModal
            modalTitle="Sleep Data"
            data={sleepData}
          />

          <ChartModal
            modalTitle="Mood Data"
            data={moodData}
          />
        </ScrollView>
     </View>
    );
  }
}

const styles = StyleSheet.create({
  pageView: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-start',
  },
});
