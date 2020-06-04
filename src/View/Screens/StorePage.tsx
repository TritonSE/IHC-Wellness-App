import * as React from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';

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
  private readonly navigation: NavigationProp<{}> = this.props.navigation
  private storeController: StoreBackend = StoreBackend.getInstance();

  private removeEnterListener = this.navigation.addListener('focus', (e) => {
    const currMoney: number = this.storeController.getMoney();
    if (currMoney !== this.state.money) {
      this.setState(() => ({ money: currMoney }));
    }
  });

  constructor(props: IProps) {
    super(props);

    this.state = {
      money: this.storeController.getMoney(),
    };
  }

  public componentWillUnmount() {
    this.removeEnterListener();
  }

  public render() {
    return (
      <View style={styles.pageContainer}>
        <AppHeader title="Store"/>
        <ScrollView style={styles.scrollContainer}>

          <StoreSection
            sectionTitle="Heads"
            plantItems={ PlantHeaders }
            storageName="headers"
          />

          <StoreSection
            sectionTitle="Stems"
            plantItems={ PlantBodies }
            storageName="bodies"
          />

          <StoreSection
            sectionTitle="Pots"
            plantItems={ PlantFooters }
            storageName="footers"
          />

        </ScrollView>
      </View>
    );
  }
}

// Element styling akin to CSS, check https://reactnative.dev/docs/flexbox for info
const styles = StyleSheet.create({
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
    padding: 20,
  },
  shopItem: {
    borderColor: 'red',
    borderWidth: 5,
    padding: 10,
    height: 100,
    width: 100,
  },
});
