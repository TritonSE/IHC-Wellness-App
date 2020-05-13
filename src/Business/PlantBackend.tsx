import * as React from 'react';
import { AsyncStorage } from 'react-native';

import { PlantBodies, PlantHeaders, PlantFooters, IStoreItem } from '../../constants/Plants';
import StoreBackend, { IOwnedItem } from './StoreBackend';
// TODO remove this import once it is replaced by values from constants/Plants.ts
// See createDefaultPlantArray() for a starter to this
import { bodies, footers, headers } from './itemProperties.tsx';

export interface IPlantItem {
  name: string;
}

// NOTE: IPlant interface refers to a single plant
export interface IPlant {
  header: IPlantItem;
  body: IPlantItem[];
  footer: IPlantItem;
}

class PlantBackend extends React.Component<object, object> {
  private static readonly PLANT_ARRAY_KEY = 'PlantArray';
  private static readonly OWNED_ARRAY_KEY = 'owned';
  private static instance: PlantBackend | null = null;

  private plantArray: IPlant[] | null = null;

  public static getInstance(): PlantBackend {
    if (!PlantBackend.instance) {
      PlantBackend.instance = new PlantBackend({});
    }
    return PlantBackend.instance;
  }

  private constructor(props: object) {
    super(props);
    console.log('PlantController created!');
    // TODO load plant and owned arrays from AsyncStorage
    // If they do not exist, call the create default methods
  }

  // TODO add default args to args where a default makes sense, e.g. plantIndex: number = 0
  public async addBody(plantIndex: number, newBody: IPlantItem) {
    // TODO move logic involving owned to StoreBackend
    const ownedIndex = 1;
    const ownedString = await AsyncStorage.getItem('owned');
    const ownedArray = JSON.parse(ownedString);

    const item = ownedArray[ownedIndex].find((itemToCheck: IOwnedItem) => {
      return itemToCheck.name === newBody.name;
    });
    if (item === undefined) {
      console.log("you don't own this item");
      return;
    }

    // update item itself and dump it into ownedArray
    item.used++;
    item.available = item.owned > item.used;
    ownedArray[ownedIndex][i] = item;
    // TODO move logic above to StoreBackend

    // add this item to the end of the body array and dump it into plantArray
    let plantArray = await AsyncStorage.getItem('PlantArray');
    plantArray = JSON.parse(plantArray);
    const currentPlant = plantArray[plantIndex];
    currentPlant.body.push(item);
    plantArray[plantIndex] = currentPlant;

    const ownedPromise = AsyncStorage.setItem('owned', JSON.stringify(ownedArray));
    const plantPromise = AsyncStorage.setItem('PlantArray', JSON.stringify(plantArray));

    // TODO below is an example of how to return multiple named values in an object
    return {
      plantPromise,
      ownedPromise,
      newPlantArray: plantArray,
      newOwnedArray: ownedArray,
    };
  }

  // TODO this is a CRUD operation updating PlantArray, as such take the previous
  // value of PlantArray as a parameter and return it along with the promise the
  // change will be saved
  public async changeBody(plantIndex, oldName, oldPlantIndex, newName) {
    const ownedIndex = 1;
    let ownedArray = await AsyncStorage.getItem('owned');
    ownedArray = JSON.parse(ownedArray);
    let oldItem = null;
    let oldIndex = 0;

    // TODO replace ALL of these for loops with Array.find() or Array.findIndex()
    // find oldItem for later update
    for (let i = 0; i < ownedArray[ownedIndex].length; i ++) {
      if (ownedArray[ownedIndex][i].name === oldName) {
        console.log('found old bodyItem');
        oldItem = ownedArray[ownedIndex][i];
        oldIndex = i;
      }
    }

    for (let i = 0; i < ownedArray[ownedIndex].length; i ++) {
      if (ownedArray[ownedIndex][i].name === newName) {
        console.log('found newBody');
        // TODO item has not been declared, fix issues like this by replacing as many
        // for loops as you can with .find(), .findIndex(), .map(), .filter() calls
        item = ownedArray[ownedIndex][i];
      }

      // check for availability
      if (!item.available) {
        console.log("you don't own this item");
        return;
      }
                // we've found newItem
      item.used++;
      item.available = item.owned > item.used;
      oldItem.used--;
      oldItem.available = oldItem.owned > oldItem.used;

      console.log('swap');
      ownedArray[ownedIndex][i] = item;
      ownedArray[ownedIndex][oldIndex] = oldItem;

                // replace updated items into async
      await AsyncStorage.setItem('owned', JSON.stringify(ownedArray));

                // update plantArray
      let plantArray = await AsyncStorage.getItem('PlantArray');
      plantArray = JSON.parse(plantArray);
      const currentPlant = plantArray[plantIndex];
      currentPlant.body[oldPlantIndex] = item;
      plantArray[plantIndex] = currentPlant;
      await AsyncStorage.setItem('PlantArray', JSON.stringify(plantArray));

    }
  }

  // TODO add default arguments for functions like these where one makes sense
  // here plantIndex: number = 0
  public async getHeader(plantIndex) {
    let plantArray = await AsyncStorage.getItem('PlantArray');
    plantArray = JSON.parse(plantArray);
    console.log(plantArray[plantIndex].header);

    // TODO all CRUD operations should return the newly created, read, updated, or deleted data
    // return plantArray[plantIndex].header
  }

  public async getBody(plantIndex) {
    let plantArray = await AsyncStorage.getItem('PlantArray');
    plantArray = JSON.parse(plantArray);
    console.log(plantArray[plantIndex].body);

    // return plantArray[plantIndex].body
  }

  public async getFooter(plantIndex) {
    let plantArray = await AsyncStorage.getItem('PlantArray');
    plantArray = JSON.parse(plantArray);
    console.log(plantArray[plantIndex].footer);

    // return plantArray[plantIndex].footer
  }

  public async changeHeader(oldName, newName, plantIndex) {
    console.log('running');
        // get ownedArray
    let ownedArray = await AsyncStorage.getItem('owned');
    ownedArray = JSON.parse(ownedArray);
        // initialize holders
    let currentItem = null;
    let oldItem = null;
    let oldIndex = 0;

    // TODO more refactoring to use .findIndex() and .find()
        // find oldItem for later update
    for (let i = 0; i < ownedArray[2].length; i ++) {
      if (ownedArray[2][i].name === oldName) {
        console.log('found old header');
        oldItem = ownedArray[2][i];
        oldIndex = i;
      }
    }

        // find new item
    for (let i = 0; i < ownedArray[2].length; i ++) {
      console.log(newName);
      console.log(ownedArray[2][i].name);
      if (ownedArray[2][i].name == newName) {
        currentItem = ownedArray[2][i];
        if (!currentItem.available) {
          console.log('You do not have enough of this header item.');
          return;
        }
                    // update currentItem and oldItem properties
        currentItem.used++;
        currentItem.available = currentItem.owned > currentItem.used;
        oldItem.used--;
        oldItem.available = oldItem.owned > oldItem.used;

        console.log('swap');
        ownedArray[2][i] = currentItem;
        ownedArray[2][oldIndex] = oldItem;

                    // replace updated items into async
        await AsyncStorage.setItem('owned', JSON.stringify(ownedArray));
                    // updates PlantArray
        let plantArray = await AsyncStorage.getItem('PlantArray');
        plantArray = JSON.parse(plantArray);
        plantArray[plantIndex].header = currentItem;

        await AsyncStorage.setItem('PlantArray', JSON.stringify(plantArray));

        return;

      }
    }
    // TODO replace console.log calls that indicate an error with actual errors
    console.log('new item not found');
    throw new Error('New item not found');
  }

  public async changeFooter(oldName, newName, plantIndex) {
    // initialize holders
    let currentItem = null;
    let oldItem = null;
    let oldIndex = 0;

    // TODO this looks like a .findIndex() can replace this
    // find oldItem for later update
    const ownedIndex = 0;
    for (let i = 0; i < ownedArray[ownedIndex].length; i ++) {
      if (ownedArray[ownedIndex][i].name === oldName) {
        console.log('found old footer');
        oldItem = ownedArray[ownedIndex][i];
        oldIndex = i;
      }
    }

    // TODO this looks like it can be refactored to use .find() instead of a for loop
    // find new item
    for (let i = 0; i < ownedArray[ownedIndex].length; i ++) {
      console.log(newName);
      console.log(ownedArray[ownedIndex][i].name);
      if (ownedArray[ownedIndex][i].name === newName) {
        currentItem = ownedArray[ownedIndex][i];
        if (!currentItem.available) {
          console.log('You do not have enough of this footer item.');
          return;
        }
        // update currentItem and oldItem properties
        currentItem.used++;
        currentItem.available = currentItem.owned > currentItem.used;
        oldItem.used--;
        oldItem.available = oldItem.owned > oldItem.used;

        console.log('swap');
        ownedArray[ownedIndex][i] = currentItem;
        ownedArray[ownedIndex][oldIndex] = oldItem;

        // replace updated items into async
        await AsyncStorage.setItem('owned', JSON.stringify(ownedArray));
        // updates PlantArray
        let plantArray = await AsyncStorage.getItem('PlantArray');
        plantArray = JSON.parse(plantArray);
        plantArray[plantIndex].footer = currentItem;

        await AsyncStorage.setItem('PlantArray', JSON.stringify(plantArray));

        return;

      }
    }
    console.log('new item not found');
  }

  private async createDefaultPlantArray() {
    // TODO refactor to use constants/Plants.ts instead of headers, bodies, footers
    // Below is an example of how to use the map higher order function to get an
    // IPlantItem[] array from IStoreItem[] array
    let ownedPlantHeaders: IPlantItem[] = PlantHeaders.map((header: IStoreItem) => {
      return {
        name: header.name,
        owned: 0,
        used: 0,
        available: false,
      };
    });

    headers[0].owned = 1;
    headers[0].used = 1;
    headers[0].available = headers[0].owned > headers[0].used;

    bodies[0].owned = 1;
    bodies[0].used = 1;
    bodies[0].available = bodies[0].owned > bodies[0].used;

    footers[0].owned = 1;
    footers[0].used = 1;
    footers[0].available = footers[0].owned > footers[0].used;

    const defaultPlant: IPlant = {
      header : { name: headers[0].name },
      body : [{ name: bodies[0].name }],
      footer : { name: footers[0].name },
    };

    ownedArray[0].push(footers[0]);
    ownedArray[1].push(bodies[0]);
    ownedArray[2].push(headers[0]);

    let temp = [defaultPlant];
    temp = JSON.stringify(temp);

    AsyncStorage.setItem('PlantArray', temp).then(() => {
      console.log("Successfully updated plant array");
    });

    AsyncStorage.setItem('owned', JSON.stringify(ownedArray)).then(() => {
      console.log("Successfully updated owned array");
    });

    // TODO do not return JSON string values, return the actual JSON objects like defaultPlant
    return temp;
  }
}

export default PlantBackend;
