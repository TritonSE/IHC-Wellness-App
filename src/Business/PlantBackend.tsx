import * as React from 'react';
import { AsyncStorage } from 'react-native';
import { bodies, footers, headers } from './itemProperties.tsx';
import { StoreBackend } from './StoreBackend.tsx';

export interface IPlantItem{
  name: string;
  price: number;
  img: string;
  owned: number;
  used: number;
  available: boolean;
}

export interface IPlant{
  header: IPlantItem[];
  body: IPlantItem[][];
  footer: IPlantItem[];
}

// tslint:disable: member-ordering
export default class PlantBackend extends React.Component<object, object> {
  private static readonly PLANT_ARRAY_KEY = 'PlantArray';
  private static readonly OWNED_ITEMS_KEY = 'owned';
  private static instance: PlantBackend | null = null;
  private plantArray;
  private ownedArray;

  private constructor(props: {}) {
    super(props);
    console.log('PlantController created!');
    AsyncStorage.getItem('PlantArray').then((result)=>{
      this.plantArray = result;
    });
    AsyncStorage.getItem('owned').then((result)=>{
      this.ownedArray = result;
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

  public async addBody(plantIndex: number = 0, newBody: IPlantItem) {
    const ownedIndex = 1;
    const ownedString = await AsyncStorage.getItem('owned');
    const ownedArray = JSON.parse(ownedString);

    // TODO replace these for loops with Array.find() or Array.findIndex()
        // loop through the body section of the ownedArray to find newBody
    const item = ownedArray[ownedIndex].find( (itemToCheck) => {
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

    // add this item to the end of the body array and dump it into plantArray
    let plantArray = await AsyncStorage.getItem('PlantArray');
    plantArray = JSON.parse(plantArray);
    const currentPlant = plantArray[plantIndex];
    currentPlant.body.push(item);
    plantArray[plantIndex] = currentPlant;

    AsyncStorage.setItem('owned', JSON.stringify(ownedArray)).then(() => {
      console.log("Successfully updated owned array");
    });
    AsyncStorage.setItem('PlantArray', JSON.stringify(plantArray)).then(() => {
      console.log("Successfully updated plant array");
    });
  }

  public async changeBody(plantIndex, oldName, oldPlantIndex, newName) {
    const ownedIndex = 1;
    let ownedArray = await AsyncStorage.getItem('owned');
    ownedArray = JSON.parse(ownedArray);
    let oldItem = null;
    let oldIndex = 0;

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

  // CHECK IF PLANT HAS BEEN CREATED
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
    console.log('new item not found');
  }

  public async changeFooter(oldName, newName, plantIndex) {
    // initialize holders
    let currentItem = null;
    let oldItem = null;
    let oldIndex = 0;

    // find oldItem for later update
    const ownedIndex = 0;
    for (let i = 0; i < ownedArray[ownedIndex].length; i ++) {
      if (ownedArray[ownedIndex][i].name === oldName) {
        console.log('found old footer');
        oldItem = ownedArray[ownedIndex][i];
        oldIndex = i;
      }
    }

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

    ownedArray[0].push(footers[0]);
    ownedArray[1].push(bodies[0]);
    ownedArray[2].push(headers[0]);

    const temp = [defaultPlant];
    const stringifiedTemp = JSON.stringify(temp);

    AsyncStorage.setItem('PlantArray', stringifiedTemp).then(() => {
      console.log("Successfully updated plant array");
    });

    AsyncStorage.setItem('owned', JSON.stringify(ownedArray)).then(() => {
      console.log("Successfully updated owned array");
    });
    return temp;
  }
}

// export default plantHelper;
