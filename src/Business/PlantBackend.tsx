import * as React from 'react';
import { AsyncStorage } from 'react-native';

// TODO replace with constants/Plants
import { PlantBodies,  PlantFooters, PlantHeaders } from '../constants/Plants';
// import { bodies, footers, headers } from './itemProperties.tsx';
import StoreBackend from './StoreBackend.tsx';

export interface IPlantItem{
  name: string;
  // stuff under here should be in IOwnedItem
  price: number;
  img: string;
  owned: number;
  used: number;
  available: boolean;
}

// Note: an IPlant refers to a single plant
export interface IPlant {
  header: IPlantItem;
  body: IPlantItem[];
  footer: IPlantItem;
}

/*
TODO
Finish implementing singleton logic by writing the constructor to get the initial plant array
and get the instance of the StoreBackend, call the private member storeController
Move data and operations involving owned items to StoreBackend
Use .find() and .findIndex() to replace for loops,
add index as a parameter to the callback if it is needed (prob shouldn't be needed though)
*/
export default class PlantBackend extends React.Component<object, object> {
  private static readonly PLANT_ARRAY_KEY = 'PlantArray';
  private static instance: PlantBackend | null = null;
  // TODO lots of this.plantArray references, change to PlantBackend.plantArray
  private static plantArray;
  private storeController;
  // TODO move this to StoreBackend and change it to an object
  private static ownedArray;

  private constructor(props: {}) {
    super(props);
    console.log('PlantController created!');

    // sets the storeController
    storeController = StoreBackend.getInstance();
    console.log("owned array is " + storeController.getOwnedArray())

    AsyncStorage.getItem('PlantArray').then((result) => {
      if (result === null) {
        PlantBackend.plantArray = PlantBackend.createDefaultPlantArray();
      } else {
        PlantBackend.plantArray = result;
      }
      console.log('plantArray ' + PlantBackend.plantArray);
    });


  }

  public static getInstance(): PlantBackend {
    if (!PlantBackend.instance) {
      PlantBackend.instance = new PlantBackend({});
    }
    return PlantBackend.instance;
  }

  public addBody(plantIndex: number = 0, newBody) {
    // TODO replace these for loops with Array.find() or Array.findIndex()
    // loop through the body section of the ownedArray to find newBody
    const bodyIndex = 1
    let tempOwnedArray = storeController.getOwnedArray();
    const item = tempOwnedArray[bodyIndex].find( (itemToCheck) => {
      return itemToCheck.name === newBody.name;
    });

    if (item === undefined) {
      console.log("you don't own this item");
      return null;
    }

    // update item itself and dump it into ownedArray
    item.used++;
    item.available = item.owned > item.used;
    tempOwnedArray[bodyIndex][i] = item;

    // add this item to the end of the body array and dump it into plantArray
    const currentPlant = PlantBackend.plantArray[plantIndex];
    currentPlant.body.push(item);
    PlantBackend.plantArray[plantIndex] = currentPlant;

    storeController.updateOwnedArray(tempOwnedArray);
    AsyncStorage.setItem('PlantArray', JSON.stringify(PlantBackend.plantArray)).then(() => {
      console.log("Successfully updated plant array");
    });
    console.log("the new owned array is " + storeController.getOwnedArray());
    // returns the body of the plant and owned array
    return {
      newBody: PlantBackend.plantArray[plantIndex].body,
      newOwned: storeController.getOwnedArray,
    };
  }

  // TODO plantIndex can be assumed to be same for new and old, so plantIndex == oldPlantIndex
  // making oldPlantIndex unnecessary
  public changeBody(plantIndex: number = 0, oldBody:IPlantItem,
                    oldPlantBodyIndex: number , newBody:IPlantItem) {
    const ownedIndex = 1;
    let oldItem = null;
    let oldIndex = 0;

    // find oldItem for later update
    const tempOwnedArray = storeController.getOwnedArray();
    oldItem = tempOwnedArray[ownedIndex].find( (element, index) => {
      if (element.name === oldBody.name){
        oldIndex = index;
        return true;
      }
    })
    /*
    for (let i = 0; i < tempOwnedArray[ownedIndex].length; i ++) {
      if (tempOwnedArray[ownedIndex][i].name === oldBody.name) {
        console.log('found old bodyItem');
        oldItem = tempOwnedArray[ownedIndex][i];
        oldIndex = i;
      }
    }
    */

    for (let i = 0; i < tempOwnedArray[ownedIndex].length; i ++) {
      if (tempOwnedArray[ownedIndex][i].name === newBody.name) {
        console.log('found newBody');
        item = tempOwnedArray[ownedIndex][i];
      }

      // check for availability
      if (!item.available) {
        console.log('This item is not available');
        return null;
      }
      // we've found newItem
      item.used++;
      item.available = item.owned > item.used;
      oldItem.used--;
      oldItem.available = oldItem.owned > oldItem.used;

      console.log('swap');
      tempOwnedArray[ownedIndex][i] = item;
      tempOwnedArray[ownedIndex][oldIndex] = oldItem;

      // update plantArray
      const currentPlant = PlantBackend.plantArray[plantIndex];
      currentPlant.body[oldPlantBodyIndex] = item;
      PlantBackend.plantArray[plantIndex] = currentPlant;

      // replace updated items into async
      storeController.updateOwnedArray(tempOwnedArray);
      AsyncStorage.setItem('PlantArray', JSON.stringify(this.ownedArray)).then(() => {
        console.log('New item successfully updated in PlantArray');
      });

      // returns the new body array and owned array
      return {
        newBody: PlantBackend.plantArray[plantIndex].body,
        newOwned: storeController.getOwnedArray(),
      };
    }
  }

  // CHECK IF PLANT HAS BEEN CREATED
  public getHeader(plantIndex: number = 0) {
    console.log('The plant header is: ' + PlantBackend.plantArray[plantIndex].header);
    return PlantBackend.plantArray[plantIndex].header;
  }

  public getBody(plantIndex: number = 0) {
    console.log('The plant body is: ' + PlantBackend.plantArray[plantIndex].body);
    return PlantBackend.plantArray[plantIndex].body;
  }

  public getFooter(plantIndex: number = 0) {
    console.log('The plant footer is: ' + PlantBackend.plantArray[plantIndex].footer);
    return PlantBackend.plantArray[plantIndex].footer
  }

  public changeHeader(plantIndex: number = 0, oldHeader:IPlantItem,
                      newHeader:IPlantItem ) {
    // header index
    const HEADER_INDEX = 2;

    // initialize holders
    let currentItem = null;
    let oldItem = null;
    let oldIndex = 0;

    // find oldItem for later update
    let tempOwnedArray = storeController.getOwnedArray();
    for (let i = 0; i < tempOwnedArray[HEADER_INDEX].length; i ++) {
      if (tempOwnedArray[HEADER_INDEX][i].name === oldHeader.name) {
        console.log('found old header');
        oldItem = tempOwnedArray[HEADER_INDEX][i];
        oldIndex = i;
      }
    }

    // find new item
    for (let i = 0; i < tempOwnedArray[HEADER_INDEX].length; i ++) {
      console.log(newHeader.name);
      console.log(tempOwnedArray[HEADER_INDEX][i].name);
      if (tempOwnedArray[HEADER_INDEX][i].name === newHeader.name) {
        currentItem = tempOwnedArray[HEADER_INDEX][i];
        if (!currentItem.available) {
          console.log('You do not have enough of this header item.');
          return null;
        }
        // update currentItem and oldItem properties
        currentItem.used++;
        currentItem.available = currentItem.owned > currentItem.used;
        oldItem.used--;
        oldItem.available = oldItem.owned > oldItem.used;

        console.log('swap');
        tempOwnedArray[HEADER_INDEX][i] = currentItem;
        tempOwnedArray[HEADER_INDEX][oldIndex] = oldItem;


        // updates PlantArray
        PlantBackend.plantArray[plantIndex].header = currentItem;

        // replace updated items into async
        storeController.updateOwnedArray(tempOwnedArray);
        AsyncStorage.setItem('PlantArray', JSON.stringify(PlantBackend.plantArray)).then(
          () => {
            console.log('PlantArray array successfully updated');
          },
        );

        // returns the new header and owned array
        return{
          newHeader: PlantBackend.plantArray[plantIndex].header,
          newOwned: storeController.getOwnedArray(),
        };

      }
    }
    console.log('new item not found');
  }

  public changeFooter(plantIndex: number = 0, oldFooter: IPlantItem,
                      newFooter:IPlantItem ) {
    // initialize holders
    let currentItem = null;
    let oldItem = null;
    let oldIndex = 0;

    // find oldItem for later update
    const ownedIndex = 0;
    let tempOwnedArray = storeController.getOwnedArray();
    for (let i = 0; i < tempOwnedArray[ownedIndex].length; i ++) {
      if (tempOwnedArray[ownedIndex][i].name === oldFooter.name) {
        console.log('found old footer');
        oldItem = tempOwnedArray[ownedIndex][i];
        oldIndex = i;
      }
    }

    // find new item
    for (let i = 0; i < tempOwnedArray[ownedIndex].length; i ++) {
      console.log(newFooter.name);
      console.log(tempOwnedArray[ownedIndex][i].name);
      if (tempOwnedArray[ownedIndex][i].name === newFooter.name) {
        currentItem = tempOwnedArray[ownedIndex][i];
        if (!currentItem.available) {
          console.log('You do not have enough of this footer item.');
          return null;
        }
        // update currentItem and oldItem properties
        currentItem.used++;
        currentItem.available = currentItem.owned > currentItem.used;
        oldItem.used--;
        oldItem.available = oldItem.owned > oldItem.used;

        console.log('swap');
        tempOwnedArray[ownedIndex][i] = currentItem;
        tempOwnedArray[ownedIndex][oldIndex] = oldItem;


        // updates PlantArray
        PlantBackend.plantArray[plantIndex].footer = currentItem;

        // replace updated items into async
        storeController.updateOwnedArray(tempOwnedArray);
        AsyncStorage.setItem('PlantArray', JSON.stringify(PlantBackend.plantArray)).then(
          () => {
            console.log('Plant array successfully updated');
          }
        );

        return{
          newFooter: PlantBackend.plantArray[plantIndex].footer,
          newOwned: storeController.getOwnedArray(),
        };

      }
    }
    console.log('new item not found');
  }

  private static createDefaultPlantArray() {
    headers[0].owned = 1;
    headers[0].used = 1;
    headers[0].available = headers[0].owned > headers[0].used;

    bodies[0].owned = 1;
    bodies[0].used = 1;
    bodies[0].available = bodies[0].owned > bodies[0].used;

    footers[0].owned = 1;
    footers[0].used = 1;
    footers[0].available = footers[0].owned > footers[0].used;

    const defaultPlant = { header : headers[0], body : [bodies[0]], footer : footers[0] };

    PlantBackend.ownedArray[0].push(footers[0]);
    PlantBackend.ownedArray[1].push(bodies[0]);
    PlantBackend.ownedArray[2].push(headers[0]);

    // TODO temp is not a descriptive variable name,
    // something like defaultPlantArray would be better
    const temp = [defaultPlant];
    const stringifiedTemp = JSON.stringify(temp);

    AsyncStorage.setItem('PlantArray', stringifiedTemp).then(() => {
      console.log("Successfully updated plant array");
    });

    AsyncStorage.setItem('owned', JSON.stringify(this.ownedArray)).then(() => {
      console.log("Successfully updated owned array");
    });
    return temp;
  }
}
