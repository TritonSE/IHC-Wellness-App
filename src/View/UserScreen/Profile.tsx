import * as React from 'react';
import { ScrollView, StyleSheet, Switch, Text, View, TextInput, Modal, Button } from 'react-native';
import { Avatar, ListItem } from 'react-native-elements';
import profileHelper from '../../Business/ProfileBackend';

import BaseIcon from './BaseIcon';
import Chevron from './Chevron';
import InfoText from './InfoText';

export interface IGarden {
  rose: string;
  tree: string;
  flower: string;
  leaf: string;
}

export interface IEmail {
  email: string;
}

export interface IProps {
  avatar: string;
  name: string;
  navigation: any;
  emails: IEmail[];
  garden: IGarden;
}

export interface IState {
  pushNotifications: boolean;
}

export default class Profile extends React.Component<IProps, IState> {

  public static defaultProps = {
    avatar: '',
    name: 'FirstName LastName',
    navigation: {},
    emails: ['FirstName.LastName@gamil.com'],
    garden: {
      rose: '0',
      tree: '0',
      flower: '0',
      leaf: '0',
    },
  };

  constructor(props: IProps) {
    super(props);
    this.state = {
      pushNotifications: true,
      modalVisible: false,
      modalInput: 0,
    };
    this.onPressOptions = this.onPressOptions.bind(this);
  }

  public onPressOptions = () => {
    this.props.navigation.navigate('options');
  };

  public render() {
    const { avatar, name, emails: [firstEmail], garden } = this.props;
    return (
      <ScrollView style={styles.scroll}>
        <View style={styles.userRow}>
          <View style={styles.userImage}>
            <Avatar
              rounded
              size="large"
              source={{
                uri: avatar,
              }}
            />
          </View>
          <View>
            <Text style={{ fontSize: 16 }}>{name}</Text>
            <Text
              style={{
                color: 'gray',
                fontSize: 16,
              }}
            >
              {firstEmail.email}
            </Text>
          </View>
        </View>
        <InfoText text="Account" />
        <View>
          <ListItem
            // hideChevron
            title="Push Notifications"
            containerStyle={styles.listItemContainer}
            rightElement={
              <Switch
                onValueChange={this.onChangePushNotifications}
                value={this.state.pushNotifications}
              />
            }
            leftIcon={
              <BaseIcon
                containerStyle={{
                  backgroundColor: '#FFADF2',
                }}
                icon={{
                  type: 'material',
                  name: 'notifications',
                }}
              />
            }
          />
          <ListItem
            // chevron
            title="Currency"
            rightTitle="USD"
            rightTitleStyle={{ fontSize: 15 }}
            onPress={() => this.onPressOptions()}
            containerStyle={styles.listItemContainer}
            leftIcon={
              <BaseIcon
                containerStyle={{ backgroundColor: '#FAD291' }}
                icon={{
                  type: 'font-awesome',
                  name: 'money',
                }}
              />
            }
            rightIcon={<Chevron />}
          />
          <ListItem
            title="Location"
            rightTitle="New York"
            rightTitleStyle={{ fontSize: 15 }}
            onPress={() => this.onPressOptions()}
            containerStyle={styles.listItemContainer}
            leftIcon={
              <BaseIcon
                containerStyle={{ backgroundColor: '#57DCE7' }}
                icon={{
                  type: 'material',
                  name: 'place',
                }}
              />
            }
            rightIcon={<Chevron />}
          />
          <ListItem
            title="Language"
            rightTitle="English"
            rightTitleStyle={{ fontSize: 15 }}
            onPress={() => this.onPressOptions()}
            containerStyle={styles.listItemContainer}
            leftIcon={
              <BaseIcon
                containerStyle={{ backgroundColor: '#FEA8A1' }}
                icon={{
                  type: 'material',
                  name: 'language',
                }}
              />
            }
            rightIcon={<Chevron />}
          />

          <ListItem
            title="Progress"
            onPress={() => {
              this.onPressOptions();
              this.setState({modalVisible: true});
              }
            }
            containerStyle={styles.listItemContainer}
            rightIcon={<Chevron />}

          />
          <Modal
               transparent = {true}
               visible = {this.state.modalVisible}>

               <View style = {styles.modalView}>
                  <Text style = {styles.modalText}>How many days back would you like to view?</Text>
                  <TextInput
                    style={styles.modalTextInput}
                    keyboardType="number-pad"
                    onChangeText={(text)=> this.setState({modalInput:text})}
                  />
                  <View style={styles.modalButtonContainer}>
                    <Button
                      title="Confirm"
                      onPress={async () => {
                          this.setState({ modalVisible: false });
                          profileHelper.retrieveDataSet(this.state.modalInput);
                        }
                      }
                    />
                    <Button
                      title="Cancel"
                      onPress={() => this.setState({ modalVisible: false })}
                    />
                  </View>
               </View>
          </Modal>
        </View>
        <InfoText text="Garden" />
        <View>
          <ListItem
            title="Rose"
            rightTitle={garden.rose}
            onPress={() => this.onPressOptions()}
            containerStyle={styles.listItemContainer}
            leftIcon={
              <BaseIcon
                containerStyle={{ backgroundColor: '#FF3B30' }}
                icon={{
                  type: 'ionicon',
                  name: 'ios-rose',
                }}
              />
            }
            rightIcon={<Chevron />}
          />
          <ListItem
            title="Tree"
            rightTitle={garden.tree}
            onPress={() => this.onPressOptions()}
            containerStyle={styles.listItemContainer}
            leftIcon={
              <BaseIcon
                containerStyle={{ backgroundColor: '#228B22' }}
                icon={{
                  type: 'entypo',
                  name: 'tree',
                }}
              />
            }
            rightIcon={<Chevron />}
          />
          <ListItem
            title="Flower"
            rightTitle={garden.flower}
            onPress={() => this.onPressOptions()}
            containerStyle={styles.listItemContainer}
            leftIcon={
              <BaseIcon
                containerStyle={{ backgroundColor: '#FF2D55' }}
                icon={{
                  type: 'entypo',
                  name: 'flower',
                }}
              />
            }
            rightIcon={<Chevron />}
          />
          <ListItem
            title="Leaf"
            rightTitle={garden.leaf}
            onPress={() => this.onPressOptions()}
            containerStyle={styles.listItemContainer}
            leftIcon={
              <BaseIcon
                containerStyle={{
                  backgroundColor: '#4CD964',
                }}
                icon={{
                  type: 'entypo',
                  name: 'leaf',
                }}
              />
            }
            rightIcon={<Chevron />}
          />
        </View>
        <InfoText text="More" />
        <View>
          <ListItem
            title="About US"
            onPress={() => this.onPressOptions()}
            containerStyle={styles.listItemContainer}
            leftIcon={
              <BaseIcon
                containerStyle={{ backgroundColor: '#A4C8F0' }}
                icon={{
                  type: 'ionicon',
                  name: 'md-information-circle',
                }}
              />
            }
            rightIcon={<Chevron />}
          />
          <ListItem
            title="Terms and Policies"
            onPress={() => this.onPressOptions()}
            containerStyle={styles.listItemContainer}
            leftIcon={
              <BaseIcon
                containerStyle={{ backgroundColor: '#C6C7C6' }}
                icon={{
                  type: 'entypo',
                  name: 'light-bulb',
                }}
              />
            }
            rightIcon={<Chevron />}
          />
          <ListItem
            title="Share our App"
            onPress={() => this.onPressOptions()}
            containerStyle={styles.listItemContainer}
            leftIcon={
              <BaseIcon
                containerStyle={{
                  backgroundColor: '#C47EFF',
                }}
                icon={{
                  type: 'entypo',
                  name: 'share',
                }}
              />
            }
            rightIcon={<Chevron />}
          />
          <ListItem
            title="Rate Us"
            onPress={() => this.onPressOptions()}
            containerStyle={styles.listItemContainer}
            badge={{
              value: 5,
              textStyle: { color: 'white' },
              containerStyle: { backgroundColor: 'gray', marginTop: 0 },
            }}
            leftIcon={
              <BaseIcon
                containerStyle={{
                  backgroundColor: '#FECE44',
                }}
                icon={{
                  type: 'entypo',
                  name: 'star',
                }}
              />
            }
            rightIcon={<Chevron />}
          />
          <ListItem
            title="Send FeedBack"
            onPress={() => this.onPressOptions()}
            containerStyle={styles.listItemContainer}
            leftIcon={
              <BaseIcon
                containerStyle={{
                  backgroundColor: '#00C001',
                }}
                icon={{
                  type: 'material',
                  name: 'feedback',
                }}
              />
            }
            rightIcon={<Chevron />}
          />
        </View>
      </ScrollView>
    );
  }

  private onChangePushNotifications = () => {
    this.setState(state => ({
      pushNotifications: !state.pushNotifications,
    }));
  }
}

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: 'white',
  },
  userRow: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: 8,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 6,
    marginTop: 50,
  },
  userImage: {
    marginRight: 12,
  },
  listItemContainer: {
    height: 55,
    borderWidth: 0.5,
    borderColor: '#ECECEC',
  },
  modalView: {
    width:"75%",
    height:250,
    alignItems: 'center',
    justifyContent:"center",
    backgroundColor: '#ffffff',
    position: "absolute",
    top:"30%",
    left:"12.5%",
    borderRadius: 15,
    borderColor:"gray",
    borderWidth:2
  },
  modalText:{
    width:"80%",
    textAlign:"center",
    justifyContent:"center",
    marginBottom:15
  },
  modalTextInput:{
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width:75,
    marginBottom:25,
    justifyContent:"center",
    textAlign:"center"
  },
  modalButtonContainer:{
    flexDirection:"row",
    width:"60%",
    justifyContent:"space-around",
  },
});
