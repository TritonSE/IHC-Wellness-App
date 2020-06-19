import * as React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';

import { NavigationProp } from '@react-navigation/native';

import { PlantBodies, PlantFooters, PlantHeaders } from '../../../constants/Plants';
import StoreSection from '../../../src/components/Store/StoreSection';
import StoreBackend from '../../Business/StoreBackend';
import AppHeader from '../../components/AppHeader';

const width = Dimensions.get('window').width;

interface IProps {
  navigation: NavigationProp<{}>;
}

interface IState {
  money: number;
}

export default class StorePage extends React.Component<IProps, IState> {
  private readonly navigation: NavigationProp<{}> = this.props.navigation;
  private storeController: StoreBackend = StoreBackend.getInstance();

  private removeEnterListener = this.navigation.addListener('focus', (e) => {
    this.storeController.getMoney()
    .then((currMoney) => {
      if (currMoney !== this.state.money) {
        this.setState(() => ({ money: currMoney }));
      }
    });
  });

  constructor(props: IProps) {
    super(props);

    this.state = {
      money: 0,
    };
  }

  public componentWillUnmount() {
    this.removeEnterListener();
  }

  private setPageMoney = (money: number) => {
    this.setState(() => ({ money }));
  }

  public render() {
    return (
      <View style={styles.pageContainer}>
        <AppHeader title="Store"/>
        <View style={styles.infoArea}>
          <Text>Money: ${this.state.money.toFixed(2)}</Text>
        </View>
        <ScrollView style={styles.scrollContainer}>

          <StoreSection
            sectionTitle="Heads"
            plantItems={ PlantHeaders }
            storageName="headers"
            setPageMoney={this.setPageMoney}
          />

          <StoreSection
            sectionTitle="Stems"
            plantItems={ PlantBodies }
            storageName="bodies"
            setPageMoney={this.setPageMoney}
          />

          <StoreSection
            sectionTitle="Pots"
            plantItems={ PlantFooters }
            storageName="footers"
            setPageMoney={this.setPageMoney}
          />

        </ScrollView>
      </View>
    );
  }
}

// Element styling akin to CSS, check https://reactnative.dev/docs/flexbox for info
const styles = StyleSheet.create({
  infoArea: {
    width,
    alignItems: 'flex-end',
    padding: 10,
  },
  pageContainer: {
    alignItems: 'center',
    // backgroundColor: 'green',
    flex: 1,
    justifyContent: 'flex-start',
    paddingLeft: 30,
    paddingRight: 30,
  },
  header: {
    fontSize: 30,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  scrollContainer: {
    width,
    paddingLeft: 20,
    paddingRight: 20,
  },
  shopItem: {
    borderColor: 'red',
    borderWidth: 5,
    padding: 10,
    height: 100,
    width: 100,
  },
});
