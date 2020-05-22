import * as React from 'react';
import { AsyncStorage } from 'react-native';

import { PlantBodies, PlantHeaders, PlantFooters, IStoreItem } from '../../constants/Plants';

export interface IOwnedItem {
  name: string;
  owned: number;
  used: number;
  available: boolean;
}

/*
TODO
Finish implementing singleton logic: in constructor load owned object
Keep CRUD operations on owned object here, owned object will be a private static member
Refactor createDefault to use .map() to create the owned arrays
Replace for loops with functions like .find() and .findIndex()
Rename non-descriptive variable names (item, value, temp etc.)
*/
export default class StoreBackend extends React.Component<object, object> {
  private money: number = 0;
  /*
  private ownedItems: {
  headers: IOwnedItem[],
  bodies: IOwnedItem[],
  footers: IOwnedItem[],
} | null = null;
*/
// TODO convert this to an object
// As an array it is not clear which is headers, bodies and footers
private ownedArray = [[], [], []];

private constructor(props: {}) {
  super(props);
}

// Note on public vs private methods: public methods will be used by frontend,
// private methods are to avoid code duplication within backend logic
// What public methods are needed are driven by what frontend/the user needs
// So since the frontend does not need to directly set money, only add money
// and spend money, setMoney should be private and methods like addMoney and
// spendMoney should be public but use setMoney to avoid code duplication
// TODO: make setMoney private, add functions addMoney() that increases money
// and spendMoney() that decreases money, they'll use setMoney as a helper function
private static setMoney(amount: number) {
  this.money = amount;
  AsyncStorage.setItem('Money', amount.toString()).then(() => {
    console.log('Successfully updated money');
  });
  return amount;
}

private static createDefaultOwnedArrays(){
  // TODO refactor to use constants/Plants.ts instead of headers, bodies, footers
  // Below is an example of how to use the map higher order function to get an
  // IOwnedItem[] array from IStoreItem[] array

  // let ownedPlantHeaders: IOwnedItem[] = PlantHeaders.map((header: IStoreItem) => {
  //   return {
  //     ...header,
  //     owned: 0,
  //     used: 0,
  //     available: false,
  //   };
  // });
  // ownedPlantHeaders[0].owned = 1;
  // ownedPlantHeaders[0].used = 1;

  // TODO replace all var keywords with let, const is even better if value does not change
  const item = [[],[],[]];
  const stringifiedItem = JSON.stringify(item);
  AsyncStorage.setItem('owned', stringifiedItem).then(() => {
    console.log("default owned array set");
  });
  return item;
}

// takes in an item and updates it and its owned and available fields in all
// owned array in async
public updateOwned(sectionIndex: number, item: IOwnedItem ){
  const indexOwnedArray = this.ownedArray[sectionIndex];
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
    // converts store item owned item (same as IPlantItem)
    item.owned = 1;
    item.used = 0;
    item.available = item.owned > item.used;
    indexOwnedArray.push(item);
  }
  this.ownedArray[sectionIndex] = indexOwnedArray;
  AsyncStorage.setItem('owned', JSON.stringify(this.ownedArray)).then(() => {
    console.log('Successfully updated owned array')
  });

  return this.ownedArray;
}

// TODO replace var with let, let that doesn't change with const, double == with triple ===
// TODO as this functions Updates the plant, move it to PlantBackend
// Also, rename functions named like this to be clearer: handle doesn't describe what change
// is happening, replace handle with a verb that describes the update (swap, add, delete etc.)
// public handlePlants(item, plantArray, section) {
//   for(let i = 0; i < plantArray.length; i++) {
//     let currentPlant = plantArray[i]
//
//     if (section == "footers") {
//       // footer
//       if (currentPlant.footer.name == item.name) {
//         // we are currently using the bought item as a footer in the plant
//
//         currentPlant.footer = item
//       }
//     } else if (section == "bodies") {
//       let bodyArray = currentPlant.body
//       for (let j = 0; j < bodyArray.length; j ++) {
//
//         let bodyItem = bodyArray[j]
//         console.log("Body:" + bodyItem.name)
//         console.log("Item:" + item.name)
//         if (bodyItem.name == item.name) {
//           bodyArray[j] = item
//           currentPlant.body = bodyArray
//         }
//       }
//
//     } else if (section == "headers") {
//       if (currentPlant.header.name == item.name) {
//         currentPlant.header = item
//       }
//     }
//     plantArray[i] = currentPlant;
//   }
//   // push plantArray
//   AsyncStorage.setItem('PlantArray', JSON.stringify(plantArray)).then(() => {
//     console.log('test');
//   });
// }

public async buyItem(item: string, section: string) {
  let newItem = null;
  // TODO move this to the constructor
  // create owned array if doesn't exist already
  if (ownedArray == null){
    console.log('created default owned array');
    StoreBackend.createDefaultOwnedArrays();
  }

  // add onto the previous array
  // TODO getAll is a code smell, access the owned array member instead
  // TODO asyncValue is not a descriptive variable name, use fn f2 to rename variables like these
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
      newItem = await StoreBackend.updateOwned(asyncValue[sectionIndex][i], sectionIndex);

      let plantArray = await AsyncStorage.getItem('PlantArray');
      plantArray = JSON.parse(plantArray);

      StoreBackend.handlePlants(newItem, plantArray, section);

      let balance = await AsyncStorage.getItem('Money');
      balance = parseInt(balance, 10)
      let cost = asyncValue[i].price
      if (balance < cost) {
        console.log("broke")
        return
      } else {
        balance -= cost
        await AsyncStorage.setItem("Money", balance.toString())
      }
    }
  }

  //item was not found, so create a new instance
  if(!found){
    alert("You are trying to buy an item that doesn't exist");
  }else{
    return newItem
  }
}

public async getItemInfo(item, list){
  let temp = null;
  const  asyncValue = StoreBackend.getAllItems();
  // adds the Item array
  const sectionIndex = StoreBackend.getListIndex(list);

  for(let i = 0; i < asyncValue[sectionIndex].length; i++){
    // item was found
    if (asyncValue[sectionIndex][i].name === item){
      temp = asyncValue[sectionIndex][i];
    }
  }
  // looks for this item in all owned and
  let ownedArray = await AsyncStorage.getItem("owned");
  ownedArray = JSON.parse(ownedArray);
  let indexOwnedArray = ownedArray[sectionIndex];
  for(let i = 0; i < indexOwnedArray.length; i++){
    if(indexOwnedArray[i].name == item){
      return indexOwnedArray[i]
    }
  }

  //item not owned yet so return hardcoded 0
  temp.owned = 0;
  temp.available = false;
  temp.used = 0;
  return temp;

}

// TODO remove this function after converting owned to an object
public getListIndex (section:string){
  switch (section) {
    case 'footers':
      return 0;
    case 'bodies':
      return 1;
    case 'headers':
      return 2;
  }
}
}
