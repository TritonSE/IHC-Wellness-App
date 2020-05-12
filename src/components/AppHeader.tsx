import * as React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Header } from 'react-native-elements';

interface IProps {
  title: string;
}

const { height, width } = Dimensions.get('window');

class AppHeader extends React.Component<IProps, object> {
  public render() {
    return (
      <View style={styles.container}>
        <Header centerComponent={{ text: this.props.title }} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width,
    flex: 1,
    marginBottom: height / 9,
    marginTop: -15,
    justifyContent: 'flex-start',
    alignItems: 'center',
    // borderWidth: 4,
    // borderColor: 'red',
  },
})

export default AppHeader;
