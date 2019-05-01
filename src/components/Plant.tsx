import * as React from 'react';
import { Dimensions, SafeAreaView, ScrollView, StatusBar, StyleSheet, View } from "react-native";

const { height } = Dimensions.get('window');

export interface IState {
  screenHeight: number;
}

export default class Plant extends React.Component<Element[], IState> {
  public readonly state: IState = {
    screenHeight: height,
  };

  public render() {
    const scrollEnabled = this.state.screenHeight > height;
    return (
      <SafeAreaView style={styles.plant}>
        <StatusBar barStyle="light-content" backgroundColor="#468189"></StatusBar>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollview}
          scrollEnabled={scrollEnabled}
          onContentSizeChange={this.onContentSizeChange}
        >
          <View style={styles.content}>
            {this.props.children}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  private onContentSizeChange = (_contentWidth: number, contentHeight: number) => {
    this.setState({ screenHeight: contentHeight });
  }
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    justifyContent: 'space-between',
    padding: 10,
  },
  plant: {
    backgroundColor: '#85D4E7',
    flex: 1,
  },
  scrollview: {
    flexGrow: 1,
  },
});
