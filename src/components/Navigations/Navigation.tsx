import { Ionicons } from '@expo/vector-icons'; // 6.2.2
import * as React from 'react';
import { createAppContainer, createBottomTabNavigator } from 'react-navigation';
import CheckInPage from '../HomeScreen/CheckInPage';
import PlantPage from '../PlantScreen/PlantPage';
import StorePage from '../StoreScreen/StorePage';
import UserPage from '../UserScreen/UserPage';
import NavIcon from './NavIcon';

const HomeIconWithBadge = (props: any) => {
  /*
   * You should pass down the badgeCount in some other ways like context, redux, mobx or
   * event emitters.
   */
  return <NavIcon {...props} badgeCount={3} />;
};

const getTabBarIcon = (navigation: any, _focused: boolean, tintColor: string | null) => {
  const { routeName } = navigation.state;
  let IconComponent = Ionicons;
  let iconName;
  if (routeName === 'CheckIn') {
    iconName = 'ios-happy';
  } else if (routeName === 'Plant') {
    iconName = 'ios-leaf';
    // We want to add badges to home tab icon
    IconComponent = HomeIconWithBadge;
  } else if (routeName === 'Store') {
    iconName = 'ios-basket';
  } else if (routeName === 'User') {
    iconName = 'ios-person';
  }

  // You can return any component that you like here!
  return <IconComponent name={iconName} size={25} color={tintColor} />;
};

export default createAppContainer(
  createBottomTabNavigator(
    {
      CheckIn: { screen: CheckInPage },
      Plant: { screen: PlantPage },
      Store: { screen: StorePage },
      User: { screen: UserPage },
    },
    {
      defaultNavigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, tintColor }) =>
          getTabBarIcon(navigation, focused, tintColor),
      }),
      tabBarOptions: {
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
      },
    },
  ),
);
