import * as React from 'react';
import { AsyncStorage } from 'react-native';

// TODO replace with constants/Plants
import { bodies, footers, headers } from './itemProperties.tsx';
import StoreBackend from './StoreBackend.tsx';

export interface IPlantItem {
  name: string;
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
  private static readonly OWNED_ITEMS_KEY = 'owned';
  private static instance: PlantBackend | null = null;
  // TODO lots of this.plantArray references, change to PlantBackend.plantArray
  private static plantArray;
  // TODO move this to StoreBackend and change it to an object
  private static ownedArray;

  private constructor(props: {}) {
    super(props);
    console.log('PlantController created!');
    AsyncStorage.getItem('owned').then((result) => {
      console.log('The owned array is currently ' + result);
      PlantBackend.ownedArray = [[],[],[]];
    });

    AsyncStorage.getItem('PlantArray').then((result) => {
      if (result === null) {
        PlantBackend.plantArray = PlantBackend.createDefaultPlantArray();
      }
      else{
        PlantBackend.plantArray = result;
      }
    });

    console.log('plantArray' + this.plantArray);
    console.log('ownedArray' + this.ownedArray);
  }

  public static getInstance(): PlantBackend {
    if (!PlantBackend.instance) {
      PlantBackend.instance = new PlantBackend({});
    }
    return PlantBackend.instance;
  }

  public addBody(plantIndex: number = 0, newBody: IPlantItem) {
    // TODO replace these for loops with Array.find() or Array.findIndex()
        // loop through the body section of the ownedArray to find newBody
    const item = this.ownedArray[ownedIndex].find( (itemToCheck) => {
      return itemToCheck.name === newBody.name;
    });

    if (item === undefined) {
      console.log("you don't own this item");
      return null;
    }

    // update item itself and dump it into ownedArray
    item.used++;
    item.available = item.owned > item.used;
    this.ownedArray[ownedIndex][i] = item;

    // add this item to the end of the body array and dump it into plantArray
    const currentPlant = this.plantArray[plantIndex];
    currentPlant.body.push(item);
    this.plantArray[plantIndex] = currentPlant;

    AsyncStorage.setItem('owned', JSON.stringify(this.ownedArray)).then(() => {
      console.log("Successfully updated owned array");
    });
    AsyncStorage.setItem('PlantArray', JSON.stringify(this.plantArray)).then(() => {
      console.log("Successfully updated plant array");
    });

    // returns the body of the plant and owned array
    return {
      newBody: this.plantArray[plantIndex].body,
      newOwned: this.ownedArray,
    };
  }

  // TODO plantIndex can be assumed to be same for new and old, so plantIndex == oldPlantIndex
  // making oldPlantIndex unnecessary
  public changeBody(plantIndex: number = 0, oldBody:IPlantItem,
                    oldPlantIndex: number , newBody:IPlantItem) {
    const ownedIndex = 1;
    let oldItem = null;
    let oldIndex = 0;

    // find oldItem for later update
    for (let i = 0; i < this.ownedArray[ownedIndex].length; i ++) {
      if (this.ownedArray[ownedIndex][i].name === oldBody.name) {
        console.log('found old bodyItem');
        oldItem = this.ownedArray[ownedIndex][i];
        oldIndex = i;
      }
    }

    for (let i = 0; i < this.ownedArray[ownedIndex].length; i ++) {
      if (this.ownedArray[ownedIndex][i].name === newBody.name) {
        console.log('found newBody');
        item = this.ownedArray[ownedIndex][i];
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
      this.ownedArray[ownedIndex][i] = item;
      this.ownedArray[ownedIndex][oldIndex] = oldItem;

      // update plantArray
      const currentPlant = this.plantArray[plantIndex];
      currentPlant.body[oldPlantIndex] = item;
      this.plantArray[plantIndex] = currentPlant;

      // replace updated items into async
      AsyncStorage.setItem('owned', JSON.stringify(this.ownedArray)).then(() => {
        console.log('New item successfully updated in owned');
      });
      AsyncStorage.setItem('PlantArray', JSON.stringify(this.ownedArray)).then(() => {
        console.log('New item successfully updated in PlantArray');
      });

      // returns the new body array and owned array
      return {
        newBody: this.plantArray[plantIndex].body,
        newOwned: this.ownedArray,
      };
    }
  }

  // CHECK IF PLANT HAS BEEN CREATED
  public getHeader(plantIndex: number = 0) {
    console.log('The plant header is: ' + this.plantArray[plantIndex].header);
    return this.plantArray[plantIndex].header;
  }

  public getBody(plantIndex: number = 0) {
    console.log('The plant body is: ' + this.plantArray[plantIndex].body);
    return this.plantArray[plantIndex].body;
  }

  public getFooter(plantIndex: number = 0) {
    console.log('The plant footer is: ' + this.plantArray[plantIndex].footer);
    return this.plantArray[plantIndex].footer
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
    for (let i = 0; i < this.ownedArray[HEADER_INDEX].length; i ++) {
      if (this.ownedArray[2][i].name === oldHeader.name) {
        console.log('found old header');
        oldItem = this.ownedArray[HEADER_INDEX][i];
        oldIndex = i;
      }
    }

    // find new item
    for (let i = 0; i < this.ownedArray[HEADER_INDEX].length; i ++) {
      console.log(newHeader.name);
      console.log(this.ownedArray[HEADER_INDEX][i].name);
      if (this.ownedArray[HEADER_INDEX][i].name === newHeader.name) {
        currentItem = this.ownedArray[HEADER_INDEX][i];
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
        this.ownedArray[HEADER_INDEX][i] = currentItem;
        this.ownedArray[HEADER_INDEX][oldIndex] = oldItem;


        // updates PlantArray
        this.plantArray[plantIndex].header = currentItem;

        // replace updated items into async
        AsyncStorage.setItem('owned', JSON.stringify(this.ownedArray)).then(() => {
          console.log('Owned array successfully updated');
        });
        AsyncStorage.setItem('PlantArray', JSON.stringify(this.plantArray)).then(
          () => {
            console.log('PlantArray array successfully updated');
          },
        );

        // returns the new header and owned array
        return{
          newHeader: this.plantArray[plantIndex].header,
          newOwned: this.ownedArray,
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
    for (let i = 0; i < this.ownedArray[ownedIndex].length; i ++) {
      if (this.ownedArray[ownedIndex][i].name === oldFooter.name) {
        console.log('found old footer');
        oldItem = this.ownedArray[ownedIndex][i];
        oldIndex = i;
      }
    }

    // find new item
    for (let i = 0; i < this.ownedArray[ownedIndex].length; i ++) {
      console.log(newFooter.name);
      console.log(this.ownedArray[ownedIndex][i].name);
      if (this.ownedArray[ownedIndex][i].name === newFooter.name) {
        currentItem = this.ownedArray[ownedIndex][i];
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
        this.ownedArray[ownedIndex][i] = currentItem;
        this.ownedArray[ownedIndex][oldIndex] = oldItem;


        // updates PlantArray
        this.plantArray[plantIndex].footer = currentItem;

        // replace updated items into async
        AsyncStorage.setItem('owned', JSON.stringify(this.ownedArray)).then(() => {
          console.log('Owned array successfully updated');
        });

        AsyncStorage.setItem('PlantArray', JSON.stringify(this.plantArray)).then(
          () => {
            console.log('Plant array successfully updated');
          }
        );

        return{
          newFooter: this.plantArray[plantIndex].footer,
          newOwned: this.ownedArray,
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
