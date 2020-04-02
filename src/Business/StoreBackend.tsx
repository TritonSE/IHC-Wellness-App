import { Alert, AsyncStorage } from 'react-native';
import { bodies, footers, headers } from './itemProperties.tsx';

const StoreBackend = {

  getFooters() {
    return footers;
  },

  getBodies() {
    return bodies;
  },

  getHeaders() {
    return headers;
  },

  getAllItems() {
    const allItems = [];
    allItems[0] = footers;
    allItems[1] = bodies;
    allItems[2] = headers;
    return allItems;
  },

  async addMoney (amount: number) {
    const currMoney = await AsyncStorage.getItem('Money');
    const newMoney = amount + parseFloat(currMoney || '0');

    await AsyncStorage.setItem('Money', newMoney.toString());
  },

  async createOwned () {
    const item = [[], [], []];
    const itemJson = JSON.stringify(item);
    await AsyncStorage.setItem('owned', itemJson);
  },

  // takes an item and updates owned and available fields in all owned array
  async handleOwned (item: object, sectionIndex: number) {
    const ownedArrayJson = await AsyncStorage.getItem('owned');
    let ownedArray = JSON.parse(ownedArrayJson || '[]');
    const indexOwnedArray = ownedArray[sectionIndex];
    let found = false;

    for (let i = 0; i < indexOwnedArray.length; i++) {
        // update item
      if (indexOwnedArray[i].name === item.name) {
        item.owned++;
        item.available = item.owned > item.used;
        indexOwnedArray[i] = item;
        found = true;
      }
    }
      // if not owned yet
    if (!found) {
      item.owned = 1;
      item.used = 0;
      item.available = item.owned > item.used;
      indexOwnedArray.push(item);
    }
    ownedArray[sectionIndex] = indexOwnedArray;
    ownedArray = JSON.stringify(ownedArray);
    await AsyncStorage.setItem('owned', ownedArray);
  },

  async buyItem (item: string, section: string) {

    const ownedValue = await AsyncStorage.getItem('owned');

    // create owned array if doesn't exist already
    if (ownedValue == null) {
      console.log('created');
      StoreBackend.createOwned();
    }

    // add onto the previous array
    const asyncValue = StoreBackend.getAllItems();

    let found = false;

    // gets the index of the section
    const sectionIndex = StoreBackend.getListIndex(section);

    // looks for the item in a certain section
    for (let i = 0; i < asyncValue[sectionIndex].length; i++) {
      // item was found
      if (asyncValue[sectionIndex][i].name === item) {
        found = true;
        // adds to owned array
        StoreBackend.handleOwned(asyncValue[sectionIndex][i], sectionIndex);

        const balanceJson = await AsyncStorage.getItem('Money');
        let balance = parseInt(balanceJson || '0', 10);
        const cost = asyncValue[i].price;
        if (balance < cost) {
          console.log('broke');
          return;
        }
        balance -= cost;
        // update asyncstorage to reflect changes
        await AsyncStorage.setItem('Money', balance.toString());
      }
    }

    // item was not found, so create a new instance
    if (!found) {
      Alert.alert("You are trying to buy an item that doesn't exist");
    }
  },

  getItemInfo: async(itemName: string, sectionName: string) => {
    let temp = null;
    const asyncValue = StoreBackend.getAllItems();
    // adds the Item array
    const sectionIndex = StoreBackend.getListIndex(sectionName);

    for (const item of asyncValue[sectionIndex]) {
      if (item.name === itemName) {
        // item was found
        temp = item;
        break;
      }
    }

    // looks for this item in all owned and
    const ownedArrayJson = await AsyncStorage.getItem('owned');
    const ownedArray = JSON.parse(ownedArrayJson || '[]');
    const indexOwnedArray = ownedArray[sectionIndex];

    for (const owned of indexOwnedArray) {
      if (owned.name === itemName) {
        return owned;
      }
    }

    // item not owned yet so return hardcoded 0
    temp.owned = 0;
    temp.available = false;
    temp.used = 0;
    return temp;
  },

  getListIndex: (section: string): number => {
    switch (section) {
      case 'footers':
        return 0;
      case 'bodies':
        return 1;
      case 'headers':
        return 2;
      default:
        throw new Error(`getListIndex received invalid section ${section}`);
    }
  },

};

export default StoreBackend;
