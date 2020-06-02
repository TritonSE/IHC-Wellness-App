import * as React from 'react';
import { AsyncStorage } from 'react-native';

import { PlantBodies, PlantHeaders, PlantFooters, IStoreItem } from '../../constants/Plants';
import PlantBackend from './PlantBackend';

export interface IOwnedItem {
  name: string;
  owned: number;
  used: number;
  available: boolean;
}

export interface IOwnedArray {
  headers: IOwnedItem[],
  bodies: IOwnedItem[],
  footers: IOwnedItem[],
}

/
export default class StoreBackend extends React.Component<object, object> {
  private static instance: StoreBackend | null = null;
  private static money: number = 0;
  private static ownedArray: {
    headers: IOwnedItem[],
    bodies: IOwnedItem[],
    footers: IOwnedItem[],
  }; 

private constructor(props: {}) {
  super(props);
  console.log("StoreController created");

  // gets the owned array from asyncstorage
  AsyncStorage.getItem('owned').then((result) => {
    if (result === null) {
      StoreBackend.ownedArray = StoreBackend.createDefaultOwnedArrays();
    } else {
      StoreBackend.ownedArray = JSON.parse(result);
    }
    console.log('owned array is  ' + StoreBackend.ownedArray);
  });
}

public static getInstance(): StoreBackend {
  if (!StoreBackend.instance) {
    StoreBackend.instance = new StoreBackend({});
  }
  return StoreBackend.instance;
}

public getOwnedArray() {
  console.log("Getting the owned array")
  return StoreBackend.ownedArray;
}

public setOwnedArray(newOwnedArray: IOwnedArray) {
  // sets member variable
  StoreBackend.ownedArray = newOwnedArray;
  // sets async storage
  AsyncStorage.setItem('owned', JSON.stringify(newOwnedArray)).then(() => {
    console.log("Successfully set owned array");
  });
}

private static setMoney(amount: number) {
  this.money = amount;
  AsyncStorage.setItem('Money', amount.toString()).then(() => {
    console.log('Successfully updated money. Current money owned: ' + this.money);
  });
  return this.money;
}

public getMoney(){
  return StoreBackend.money;
}

public addMoney(amount: number){
  const newAmount = StoreBackend.money + amount;
  return StoreBackend.setMoney(newAmount);
}

// if the user does not have enough money to spend, return null
public spendMoney(amount: number){
  const newAmount = StoreBackend.money - amount;
  if(newAmount < 0 ){
    console.log("You do not have enough money")
    return null
  }
  return StoreBackend.setMoney(newAmount);
}

private static createDefaultOwnedArrays(){
  //creates array of all the headers and set the first item to be used
  let ownedPlantHeaders: IOwnedItem[] = PlantHeaders.map((header: IStoreItem) => {
    return {
      ...header,
      owned: 0,
      used: 0,
      available: false,
    };
  });
  ownedPlantHeaders[0].owned = 1;
  ownedPlantHeaders[0].used = 1;

  //creates array of all the bodies and set the first item to be used
  let ownedPlantBodies: IOwnedItem[] = PlantBodies.map((body: IStoreItem) => {
    return {
      ...body,
      owned: 0,
      used: 0,
      available: false,
    };
  });
  ownedPlantBodies[0].owned = 1;
  ownedPlantBodies[0].used = 1;

  //creates array of all the footers and set the first item to be used
  let ownedPlantFooters: IOwnedItem[] = PlantFooters.map((footer: IStoreItem) => {
    return {
      ...footer,
      owned: 0,
      used: 0,
      available: false,
    };
  });
  ownedPlantFooters[0].owned = 1;
  ownedPlantFooters[0].used = 1;

  const defaultOwned: IOwnedArray= {
    headers: ownedPlantHeaders,
    bodies: ownedPlantBodies,
    footers: ownedPlantFooters
  };
  const stringifiedItem = JSON.stringify(defaultOwned);
  AsyncStorage.setItem('owned', stringifiedItem).then(() => {
    console.log("default owned array set");
  });
  console.log("Create Default Owned Array was called");
  return defaultOwned;
}

// Simulates buying one item by increasing the owned amount by 1, returns the item that was updated
private static updateOwnedBy1(sectionName: string, item: IOwnedItem ){
  //checks if section name is one of "headers, "bodies", "footers"
  if(sectionName != "headers" && sectionName != "bodies" && sectionName != "footers"){
    console.log("A valid section name was not passed in. Must be 'headers', 'bodies', or 'footers'");
    return null;
  }

  //gets the section of the owned array we're interested in
  const sectionArray = StoreBackend.ownedArray[sectionName];
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
  StoreBackend.ownedArray[sectionName] = sectionArray;
  AsyncStorage.setItem('owned', JSON.stringify(StoreBackend.ownedArray)).then(() => {
    console.log('Successfully updated owned array')
  });

  //returns the updated item
  return item;
}


public buyItem(sectionName: string, itemName: string) {
  //checks if section name is one of "headers, "bodies", "footers"
  if(sectionName != "headers" && sectionName != "bodies" && sectionName != "footers"){
    console.log("A valid section name was not passed in. Must be 'headers', 'bodies', or 'footers'");
    return null;
  }

  //keeps track of which section we're in so we get get the item's price
  let storeSection;
  switch(sectionName){
    case "headers":
      storeSection = PlantHeaders;
    case "bodies":
      storeSection = PlantBodies;
    case "footers":
      storeSection = PlantFooters;
  }

  let itemAfterUpdate = null;

  let found = false;

  // looks for the item in a certain section
  const sectionArray = StoreBackend.ownedArray[sectionName];
  for (let i = 0; i < sectionArray.length; i++) {
    // item was found
    if (sectionArray[i].name === itemName) {
      found = true;

      // checks whether user has enough money to buy the item before updating
      let cost = storeSection[i].price
      if (StoreBackend.money < cost) {
        console.log("You do not have enough money to buy this item")
        return null;
      } else {
        StoreBackend.money -= cost
        AsyncStorage.setItem("Money", StoreBackend.money.toString()).then(()=>{
          console.log("Cost of item has been successfully deducted from your balance")
        })

  
        // the item was found, so increased owned count by 1 in owned array
        itemAfterUpdate = StoreBackend.updateOwnedBy1(sectionName, sectionArray[i]);
        //updates the plany array 
        PlantBackend.getInstance().handlePlants(sectionName, itemAfterUpdate);

        //updates owned array 
        if(itemAfterUpdate != null){
          sectionArray[i] = itemAfterUpdate;
          StoreBackend.ownedArray[sectionName] = sectionArray;
          AsyncStorage.setItem("owned", JSON.stringify(StoreBackend.ownedArray)).then(()=>{
            console.log("owned array has been successfully updated in asyncstorage after an item purchase")
          })
        }
        
        
        //returns the item after it has been updated to reflect purchase
        return itemAfterUpdate;
      }
    }
  }

  //item was not found. It does not exist
  if(!found){
    console.log("This item does not exist in the database");
    return null;
  }
  return itemAfterUpdate;
}


//gets a specific item from owned array 
  public getItemInfo(sectionName:string, itemName:string){
  //checks if section name is one of "headers, "bodies", "footers"
  if(sectionName != "headers" && sectionName != "bodies" && sectionName != "footers"){
    console.log("A valid section name was not passed in. Must be 'headers', 'bodies', or 'footers'");
    return null;
  }

  let itemToFind = null;
  const sectionArray = StoreBackend.ownedArray[sectionName];

  for (let i = 0; i < sectionArray.length; i++){
    // item was found
    if (sectionArray[i].name === itemName){
      itemToFind = sectionArray[i];
    }
  }

  return itemToFind;

  }
}
