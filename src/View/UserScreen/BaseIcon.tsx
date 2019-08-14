import { Entypo, FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons'; // 6.2.2
import * as React from 'react';
import { StyleSheet, View } from 'react-native';

export interface IIcon {
  name: string;
  type: string;
}

export interface IProps {
  containerStyle?: object;
  icon: IIcon;
  iconStyle?: object;
}

export default class BaseIcon extends React.Component<IProps, object> {
  public static defaultProps = {
    containerStyle: {},
    icon: {},
    iconStyle: {},
  };

  public getIcon(type: string, name: string) {
    switch(type) {
      case 'material':
        return <MaterialIcons size={24} color="white" name={name}/>;
      case 'font-awesome':
        return <FontAwesome size={24} color="white" name={name}/>;
      case 'ionicon':
        return <Ionicons size={24} color="white" name={name}/>;
      case 'entypo':
        return <Entypo size={24} color="white" name={name}/>;
      default:
        return <Ionicons size={24} color="white" name="ios-notifications"/>;
    }
  }

  public render() {
    const { containerStyle, icon } = this.props;
    const { type, name } = icon;
    return (
      <View style={[styles.container, containerStyle]}>
        {this.getIcon(type, name)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'black',
    borderColor: 'transparent',
    borderRadius: 10,
    borderWidth: 1,
    height: 34,
    justifyContent: 'center',
    marginLeft: 10,
    marginRight: 18,
    width: 34,
  },
});
