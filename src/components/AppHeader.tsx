import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Header } from 'react-native-elements';

interface IProps {
  title: string;
}

class AppHeader extends React.Component<IProps, object> {
  public render() {
    return (
      <View style={styles.container}>
        <Header centerComponent={{ text: this.props.title, style: styles.header }} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 0,
    justifyContent: 'flex-start',
    alignItems: 'center',
    //borderWidth: 4,
    borderColor: 'red',
  },
  header: {
    //flex: 1,
    marginBottom: 0,
  }
})

export default AppHeader;
