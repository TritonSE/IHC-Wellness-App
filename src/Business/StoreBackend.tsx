import * as React from 'react';
import { AsyncStorage } from 'react-native';

import { IStoreItem, PlantBodies, PlantFooters, PlantHeaders } from '../../constants/Plants';

export interface IOwnedItem {
  name: string;
  owned: number;
  used: number;
  available: boolean;
}

export interface IOwned {
  headers: IOwnedItem[];
  bodies: IOwnedItem[];
  footers: IOwnedItem[];
}

export enum OwnedSectionName {
  headers = 'headers',
  bodies = 'bodies',
  footers = 'footers',
}

const OWNED_KEY = 'owned';
const MONEY_KEY = 'Money';

/**
 * Class  for StoreBackend model
 * has an instance of storebackend
 * amount of money
 * default ownedObject
 */
export default class StoreBackend extends React.Component<object, object> {
  private static instance: StoreBackend;
  private static money: number = -1;
  private static ownedObject: IOwned;

  /**
   * Creates storeController and ownedObject
   * @param props empty props list
   */
  private constructor(props: {}) {
    super(props);
    console.log('StoreController created');

    // TODO replace with logic similar to the above getItem
    StoreBackend.setMoney(1000);
  }

  /**
   * @returns instance of store Backend in this model
   */
  public static getInstance(): StoreBackend {
    if (!StoreBackend.instance) {
      StoreBackend.instance = new StoreBackend({});
    }
    return StoreBackend.instance;
  }

  /**
   * @returns current owned array
   */
  public async getOwned() {
    console.log(`StoreBackend getOwned(): ${StoreBackend.ownedObject}`);
    if (StoreBackend.ownedObject) return StoreBackend.ownedObject;

    console.log('Getting the owned object from storage');

    // gets the owned array from asyncstorage
    const ownedString = await AsyncStorage.getItem(OWNED_KEY);
    if (ownedString === null) {
      StoreBackend.ownedObject = StoreBackend.createDefaultOwnedObject();
    } else {
      StoreBackend.ownedObject = JSON.parse(ownedString);
    }

    console.log(`owned array is ${JSON.stringify(StoreBackend.ownedObject)}`);
    return StoreBackend.ownedObject;
  }

  /**
   * Checks to see if an item is avaiale in the owned array
   * @param sectionName the name of the section to look at
   * @param itemToCheck the item to check whether it is avaiable in owned array
   * @return boolean representing whether we own that item
   */
  public isItemAvailable(sectionName: string, itemToCheck: string) {
    // checks if section name is one of 'headers, 'bodies', 'footers'
    if (sectionName !== 'headers' && sectionName !== 'bodies' && sectionName !== 'footers') {
      console.log('A valid section name was not passed in. Must be \'headers\', \'bodies\', or \'footers\'');
      return {
        index: -1,
        object: undefined,
      };
    }

    let itemIndex = -1;
    const item = StoreBackend.ownedObject[sectionName].find((element: IOwnedItem,
                                                             index: number) => {
      if (element.name === itemToCheck) {
        itemIndex = index;
        return true;
      }
      return false;
    });
    console.log(`The item you are looking for is ${item.name} and it was found at index ${itemIndex}`);

    return {
      index: itemIndex,
      object: item,
    };
  }

  /**
   * increases item count in ownedObject
   * @param sectionName the name of the section to look at
   * @param index the index of the item to increment
   * @return the owned object
   */
  public incrementItemUsage(sectionName: string, index: number) {
    // checks if section name is one of 'headers, 'bodies', 'footers'
    if (sectionName !== 'headers' && sectionName !== 'bodies' && sectionName !== 'footers') {
      console.log('A valid section name was not passed in. Must be \'headers\', \'bodies\', or \'footers\'');
      return null;
    }

    // increments the item
    const tempOwned = StoreBackend.ownedObject;
    const item = tempOwned[sectionName][index];
    item.used++;
    item.available = item.owned > item.used;
    tempOwned[sectionName][index] = item;

    return StoreBackend.ownedObject;
  }

  /**
   * decreases item count in ownedObject
   * @param sectionName the name of the section to look at
   * @param index the index of the item to decrement
   * @return the owned object
   */
  public decrementItemUsage(sectionName: string, index: number) {
    // checks if section name is one of 'headers, 'bodies', 'footers'
    if (sectionName !== 'headers' && sectionName !== 'bodies' && sectionName !== 'footers') {
      console.log('A valid section name was not passed in. Must be \'headers\', \'bodies\', or \'footers\'');
      return null;
    }

    // increments the item
    const tempOwned = StoreBackend.ownedObject;
    const item = tempOwned[sectionName][index];
    item.used--;
    item.available = item.owned > item.used;
    tempOwned[sectionName][index] = item;

    return StoreBackend.ownedObject;
  }

  /**
   * @param newOwnedObject new owned object to set to
   */
  public setOwned(newOwnedObject: IOwned): Promise<void> {
    // sets member variable
    StoreBackend.ownedObject = newOwnedObject;

    // sets async storage
    return AsyncStorage.setItem(OWNED_KEY, JSON.stringify(newOwnedObject));
  }

  /**
   * @returns current amount of money
   */
  public async getMoney() {
    if (StoreBackend.money < 0) {
      const moneyString = await AsyncStorage.getItem(MONEY_KEY);
      StoreBackend.money = JSON.parse(moneyString || '0');
    }

    return StoreBackend.money;
  }

  /**
   * adds amount to money
   * @param amount amount to add
   */
  public addMoney(amount: number): number {
    const newAmount = StoreBackend.money + amount;
    return StoreBackend.setMoney(newAmount);
  }

  /**
   * Spends user's money
   * @param amount of money to spend
   * @returns new amount
   */
  public spendMoney(amount: number): number {
    const newAmount = StoreBackend.money - amount;
    if (newAmount < 0) {
      console.log('You do not have enough money');
      return StoreBackend.money;
    }
    return StoreBackend.setMoney(newAmount);
  }

  /**
   * sets money amount
   * @param amount new money amount
   */
  private static setMoney(amount: number): number {
    this.money = amount;
    AsyncStorage.setItem(MONEY_KEY, amount.toString()).then(() => {
      console.log(`Successfully updated money. Current money owned: ${this.money}`);
    });
    return this.money;
  }

  /**
   * creates a default owned array and @returns it
   */
  private static createDefaultOwnedObject(): IOwned {
    // creates array of all the headers and set the first item to be used
    const ownedPlantHeaders: IOwnedItem[] = PlantHeaders.map((header: IStoreItem) => {
      return {
        name: header.name,
        owned: 0,
        used: 0,
        available: false,
      };
    });
    ownedPlantHeaders[0].owned = 2;
    ownedPlantHeaders[0].used = 1;
    ownedPlantHeaders[0].available = true;
    console.log(`createDefaultOwnedObject: ${JSON.stringify(ownedPlantHeaders[0])}`);

    // creates array of all the bodies and set the first item to be used
    const ownedPlantBodies: IOwnedItem[] = PlantBodies.map((body: IStoreItem) => {
      return {
        name: body.name,
        owned: 0,
        used: 0,
        available: false,
      };
    });
    ownedPlantBodies[0].owned = 2;
    ownedPlantBodies[0].used = 1;
    ownedPlantBodies[0].available = true;

    // creates array of all the footers and set the first item to be used
    const ownedPlantFooters: IOwnedItem[] = PlantFooters.map((footer: IStoreItem) => {
      return {
        name: footer.name,
        owned: 0,
        used: 0,
        available: false,
      };
    });
    ownedPlantFooters[0].owned = 2;
    ownedPlantFooters[0].used = 1;
    ownedPlantFooters[0].available = true;

    const defaultOwned: IOwned = {
      headers: ownedPlantHeaders,
      bodies: ownedPlantBodies,
      footers: ownedPlantFooters,
    };

    const stringifiedItem = JSON.stringify(defaultOwned);
    AsyncStorage.setItem(OWNED_KEY, stringifiedItem).then(() => {
      console.log('default owned array set');
    });

    return defaultOwned;
  }

  /**
   * Simulates buying one item by increasing the owned amount by 1
   * @param sectionName either headers, bodies, or footers
   * @param item item to update by one
   */
  private static updateOwnedBy1(sectionName: string, item: IOwnedItem) {
    // checks if section name is one of 'headers, 'bodies', 'footers'
    if (sectionName !== 'headers' && sectionName !== 'bodies' && sectionName !== 'footers') {
      console.log('A valid section name was not passed in. Must be \'headers\', \'bodies\', or \'footers\'');
      return null;
    }

    // gets the section of the owned array we're interested in
    const sectionArray = StoreBackend.ownedObject[sectionName];
    let found = false;

    for (let i = 0; i < sectionArray.length; i++) {
      // update item
      if (sectionArray[i].name === item.name) {
        item.owned++;
        item.available = item.owned > item.used;
        sectionArray[i] = item;
        found = true;
      }
    }

    // if not owned yet
    if (!found) {
      // converts store item owned item (same as IPlantItem)
      item.owned = 1;
      item.used = 0;
      item.available = item.owned > item.used;
      sectionArray.push(item);
    }
    StoreBackend.ownedObject[sectionName] = sectionArray;
    AsyncStorage.setItem(OWNED_KEY, JSON.stringify(StoreBackend.ownedObject))
    .then(() => {
      console.log('Successfully updated owned array');
    });

    // returns the updated item
    return item;
  }

  /**
   * @returns new item after update, null on error
   * @param sectionName either header, bodies, or footers
   * @param itemName name of item to buy
   */
  public async buyItem(sectionName: string, itemName: string) {
    // checks if section name is one of 'headers, 'bodies', 'footers'
    if (sectionName !== 'headers' && sectionName !== 'bodies' && sectionName !== 'footers') {
      console.log('A valid section name was not passed in. Must be \'headers\', \'bodies\', or \'footers\'');
      return null;
    }

    if (!StoreBackend.ownedObject) {
      StoreBackend.ownedObject = await this.getOwned();
    }

    // keeps track of which section we're in so we get get the item's price
    let storeSection;
    switch (sectionName) {
      case 'headers':
        storeSection = PlantHeaders;
      case 'bodies':
        storeSection = PlantBodies;
      case 'footers':
        storeSection = PlantFooters;
    }

    let itemAfterUpdate = null;

    let found = false;

    // TODO try to remove the 3 for-loops in this file
    // looks for the item in a certain section
    const sectionArray = StoreBackend.ownedObject[sectionName];
    const itemIndex = sectionArray.find((item) => item.name === item.name);
    for (let i = 0; i < sectionArray.length; i++) {
      // item was found
      if (sectionArray[i].name === itemName) {
        found = true;

        // checks whether user has enough money to buy the item before updating
        const cost = storeSection[i].price;
        if (StoreBackend.money < cost) {
          console.log('You do not have enough money to buy this item');
          return null;
        }

        // TODO
        this.spendMoney(cost);
        /*
        StoreBackend.money -= cost;
        AsyncStorage.setItem(MONEY_KEY, StoreBackend.money.toString()).then(() => {
          console.log('Cost of item has been successfully deducted from your balance');
        });
        */

        // the item was found, so increased owned count by 1 in owned array
        itemAfterUpdate = StoreBackend.updateOwnedBy1(sectionName, sectionArray[i]);

        // updates owned array
        if (itemAfterUpdate != null) {
          sectionArray[i] = itemAfterUpdate;
          StoreBackend.ownedObject[sectionName] = sectionArray;
          AsyncStorage.setItem(OWNED_KEY, JSON.stringify(StoreBackend.ownedObject)).then(() => {
            console.log('owned array has been successfully updated in asyncstorage after an item purchase');
          });
        }

        // returns the item after it has been updated to reflect purchase
        return {
          money: StoreBackend.money,
          ownedItem: itemAfterUpdate,
        };
      }
    }

    // item was not found. It does not exist
    if (!found) {
      console.log('This item does not exist in the database');
      return null;
    }
    return {
      money: StoreBackend.money,
      ownedItem: itemAfterUpdate,
    };
  }

  /**
   * gets a specific item from owned array
   * @param sectionName either headers, bodies, or footers
   * @param itemName name of item to @return
   */
  public getItemInfo(sectionName: string, itemName: string) {
    // checks if section name is one of 'headers, 'bodies', 'footers'
    if (sectionName !== 'headers' && sectionName !== 'bodies' && sectionName !== 'footers') {
      console.log('A valid section name was not passed in. Must be \'headers\', \'bodies\', or \'footers\'');
      return null;
    }

    let itemToFind = null;
    const sectionArray = StoreBackend.ownedObject[sectionName];

    for (const element of sectionArray) {
      // item was found
      if (element.name === itemName) {
        itemToFind = element;
      }
    }

    return itemToFind;
  }
}
