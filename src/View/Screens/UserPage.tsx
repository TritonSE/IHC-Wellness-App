import * as React from 'react';
import NavAbsolute from '../Navigations/NavAbsolute';
import Profile from '../UserScreen/Profile';
import UserData from '../UserScreen/UserData';

export interface IProps {
  navigation: any;
}

export default class UserPage extends React.Component<IProps, object> {
  public navigationOptions = ({ navigation }) => ({
    header: (
      <NavAbsolute
        title="Settings"
        navigation={navigation}
      />
    ),
  })

  public render() {
    const { navigation } = this.props;
    return (
      <Profile {...UserData} navigation={navigation}/>
    );
  }
}
