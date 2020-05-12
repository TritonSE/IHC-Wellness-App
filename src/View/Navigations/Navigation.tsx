import { Ionicons } from '@expo/vector-icons'; // 6.2.2
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import * as React from 'react';

import CheckinPage from '../Screens/CheckinPage';
import PlantPage from '../Screens/PlantPage';
import StorePage from '../Screens/StorePage';
import UserPage from '../Screens/UserPage';
import NavIcon from './NavIcon';

const HomeIconWithBadge = (props: any) => {
  /*
   * You should pass down the badgeCount in some other ways like context, redux, mobx or
   * event emitters.
   */
  return <NavIcon {...props} badgeCount={3} />;
};

const getTabBarIcon = (route: any, _focused: boolean, tintColor: string | null) => {
  const routeName = route.name;
  let IconComponent = Ionicons;
  let iconName;
  if (routeName === 'Checkin') {
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

const Tab = createBottomTabNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) =>
            getTabBarIcon(route, focused, color),
        })}
        tabBarOptions={{
          activeTintColor: 'tomato',
          inactiveTintColor: 'gray',
        }}
      >
        <Tab.Screen name="Checkin" component={CheckinPage} />
        <Tab.Screen name="Plant"   component={PlantPage} />
        <Tab.Screen name="Store"   component={StorePage} />
        <Tab.Screen name="User"    component={UserPage} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
