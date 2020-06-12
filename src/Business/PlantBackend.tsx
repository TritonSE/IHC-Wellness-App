import * as React from 'react';
import { AsyncStorage } from 'react-native';

import { PlantBodies,  PlantFooters, PlantHeaders } from '../../constants/Plants';
import StoreBackend, { IOwned, IOwnedItem } from './StoreBackend';

export interface IPlantItem {
  name: string;
}

// Note: an IPlant refers to a single plant
export interface IPlant {
  header: IPlantItem;
  body: IPlantItem[];
  footer: IPlantItem;
}

export enum PlantSectionName {
  header = 'header',
  body = 'body',
  footer = 'footer',
}

export default class PlantBackend extends React.Component<object, object> {
  private static instance: PlantBackend | null = null;
  private static plantArray: IPlant[];
  private storeController: StoreBackend;

  /**
   * Constructor creates default plant array and sets storeController
   * @param: none
   * @returns : none
   */
  private constructor(props: {}) {
    super(props);
    console.log('PlantController created!');

    // sets the storeController
    this.storeController = StoreBackend.getInstance();
  }

  /**
   * Helper getInstance method that returns the plantBackend model
   * @param: PlantBackend
   * @returns: instance of plantBackend
   */
  public static getInstance(): PlantBackend {
    if (!PlantBackend.instance) {
      PlantBackend.instance = new PlantBackend({});
    }
    return PlantBackend.instance;
  }

  /**
   * Gets the a specific plant from the plant array
   * @param: the index of the plant you want
   * @returns: the promise of the plant at specific index
   */
  public async getPlant(index: number = 0) {
    if (PlantBackend.plantArray && PlantBackend.plantArray[index]) {
      return PlantBackend.plantArray[index];
    }

    return AsyncStorage.getItem('PlantArray')
    .then((result) => {
      if (result === null) {
        PlantBackend.plantArray = PlantBackend.createDefaultPlantArray();
      } else {
        PlantBackend.plantArray = JSON.parse(result);
      }
      return PlantBackend.plantArray[index];
    });
  }

  /**
   * When an item is bought in store, need to update its presence in the plantArray
   * @param sectionName either header, footer, or bodies so we konw which array to update
   * @param item the item that we are trying to reflect the changes of
   * @returns: null iff the item is invalid
   */
  public handlePlants(sectionName: string, item: IOwnedItem | null) {
    if (item === null) {
      console.log('The item passed in is invalid, plant array has not been changed');
      return null;
    }
    // loops through all the plants the user owns
    for (let i = 0; i < PlantBackend.plantArray.length; i++) {
      const currentPlant = PlantBackend.plantArray[i];

      // we are looking at the footer array
      if (sectionName === 'footers') {
        // we are currently using the bought item as a footer in the plant
        if (currentPlant.footer.name === item.name) {
          currentPlant.footer = item;
        }
      } else if (sectionName === 'bodies') {
        // we are looking at the bodies array
        const bodyArray = currentPlant.body;
        for (let j = 0; j < bodyArray.length; j ++) {
          // we are currently using the bought item as a body in the plant
          const bodyItem = bodyArray[j];
          if (bodyItem.name === item.name) {
            bodyArray[j] = item;
            currentPlant.body = bodyArray;
          }
        }
      } else if (sectionName === 'headers') {
        // we are currently using the bought item as a header in the plant
        if (currentPlant.header.name === item.name) {
          currentPlant.header = item;
        }
      }

      // pushes all changes to the plant array
      PlantBackend.plantArray[i] = currentPlant;
    }
    // push plantArray
    AsyncStorage.setItem('PlantArray', JSON.stringify(PlantBackend.plantArray))
    .then(() => {
      console.log('The plant array has been updated after an item has been bought');
    });
  }

  /**
   * Adds a new body item to the plant
   * @param plantIndex which plant to add to
   * @param newBodyName name of new body item
   * @return: null if failure to addBody
   *          else, returns body of plant and new ownedArray
   */
  public addBody(plantIndex: number = 0, newBodyName: string) {
    const resultOfSearch = this.storeController.isItemAvailable('bodies', newBodyName);
    const item = resultOfSearch.object;
    const itemIndex = resultOfSearch.index;

    if (item === undefined || itemIndex < 0) {
      console.log('you don\'t own this item');
      return null;
    }

    // checks if this item is available
    if (!item.available) {
      console.log('You are trying to add a body when you don\'t hvae enough of it');
      return null;
    }
    // update item itself and puts the updated item back into owned array
    const updatedOwned = this.storeController.incrementItemUsage('bodies', itemIndex);
    if (updatedOwned === null) {
      console.log('The sectionName passed in was wrong');
      return;
    }

    // add this item to the end of the body array and then update plantArray
    const currentPlant = PlantBackend.plantArray[plantIndex];
    const newPlantItem: IPlantItem = { name: item.name };
    currentPlant.body.push(newPlantItem);
    PlantBackend.plantArray[plantIndex] = currentPlant;

    this.storeController.setOwned(updatedOwned);

    AsyncStorage.setItem('PlantArray', JSON.stringify(PlantBackend.plantArray))
    .then(() => {
      console.log('Successfully updated plant array after adding body');
    });

    // returns the body of the plant and owned array
    return {
      newBody: PlantBackend.plantArray[plantIndex].body,
      newOwned: this.storeController.getOwned(),
    };
  }

  /**
   * Swaps out a body item in the plant's body array
   * @param plantIndex which plant to update
   * @param oldPlantBodyIndex which old body item we want to swap out
   * @param oldBodyName name of that old body item
   * @param newBodyName name of the new body item
   * @returns: null if item is invalid
   *           else returns the new body and owned arrays
   */
  public changeBody(plantIndex: number = 0, oldPlantBodyIndex: number,
                    oldBodyName: string, newBodyName: string) {

    // looks to see if the old item is currently in ownedObject
    const resultOfSearchingOldBody = this.storeController.isItemAvailable('bodies', oldBodyName);
    const oldItem = resultOfSearchingOldBody.object;
    const oldIndex = resultOfSearchingOldBody.index;

    if (oldItem === undefined) {
      console.log('old item in plant couldn\'t be found');
      return null;
    }
    console.log('found oldBody in owned array');

    // looks to see if the new item is currently in ownedObject
    const resultOfSearchingNewBody = this.storeController.isItemAvailable('bodies', newBodyName);
    const newItem = resultOfSearchingNewBody.object;
    const newIndex = resultOfSearchingNewBody.index;

    if (newItem === undefined) {
      console.log('new item in owned couldn\'t be found');
      return null;
    }
    console.log('found newBody in owned array');

    // check for availability of the new item
    if (!newItem.available) {
      console.log('You do not have enough of the new item to swap it into your plant');
      return null;
    }
    // newItem was found, decrement old usage and increment new usage
    let updatedOwnedObject = this.storeController.decrementItemUsage('bodies', oldIndex);
    if (updatedOwnedObject === null) return;

    updatedOwnedObject = this.storeController.incrementItemUsage('bodies', newIndex);
    if (updatedOwnedObject === null) return;

    console.log('swapping body of plant');

    // update plantArray
    const currentPlant = PlantBackend.plantArray[plantIndex];
    const newPlantItem: IPlantItem = { name: newItem.name };
    currentPlant.body[oldPlantBodyIndex] = newPlantItem;
    PlantBackend.plantArray[plantIndex] = currentPlant;

    // replace updated items into async
    this.storeController.setOwned(updatedOwnedObject);

    AsyncStorage.setItem('PlantArray', JSON.stringify(PlantBackend.plantArray))
    .then(() => {
      console.log('New item successfully swapped in plant body');
    });

    // returns the new body array and owned array
    return {
      newBody: PlantBackend.plantArray[plantIndex].body,
      promiseForOwned: this.storeController.getOwned(),
    };
  }

  /**
   * @returns header of plant at passed in index
   * @param plantIndex index of plant whose header we want
   */
  public getHeader(plantIndex: number = 0) {
    if (PlantBackend.plantArray != null) {
      console.log(`The plant header is: ${PlantBackend.plantArray[plantIndex].header}`);
      return PlantBackend.plantArray[plantIndex].header;
    }
    console.log('The plant array does not exist yet');
    return null;
  }

  /**
   * @returns body of plant at passed in index
   * @param plantIndex index of plant whose body we want
   */
  public getBody(plantIndex: number = 0) {
    if (PlantBackend.plantArray != null) {
      console.log(`The plant body is: ${PlantBackend.plantArray[plantIndex].body}`);
      return PlantBackend.plantArray[plantIndex].body;
    }
    console.log('The plant array does not exist yet');
    return null;
  }

  /**
   * @returns footer of plant at passed in index
   * @param plantIndex index of plant whose footer we want
   */
  public getFooter(plantIndex: number = 0) {
    if (PlantBackend.plantArray != null) {
      console.log(`The plant footer is: ${PlantBackend.plantArray[plantIndex].footer}`);
      return PlantBackend.plantArray[plantIndex].footer;
    }
    console.log('The plant array does not exist yet');
    return null;
  }

  /**
   * @returns null if failure, new header and owned array if success
   * @param plantIndex index of plant whose header we want to change
   * @param oldHeaderName name of oldheader item
   * @param newHeaderName name of new header item
   */
  public changeHeader(plantIndex: number = 0, oldHeaderName: string, newHeaderName: string) {

    // looks to see if the old item is currently in ownedObject
    const resultOfSearchingOldHeader = this.storeController.isItemAvailable('headers',
                                                                            oldHeaderName);
    const oldItem = resultOfSearchingOldHeader.object;
    const oldIndex = resultOfSearchingOldHeader.index;

    if (oldItem === undefined || oldItem === null) {
      console.log('old item in plant couldn\'t be found');
      return null;
    }
    console.log('found oldHeader in owned array');

    // looks to see if the old item is currently in ownedObject
    const resultOfSearchingNewHeader = this.storeController.isItemAvailable('headers',
                                                                            newHeaderName);
    const newItem = resultOfSearchingNewHeader.object;
    const newIndex = resultOfSearchingNewHeader.index;

    if (newItem === undefined || newItem === null) {
      console.log('new item in owned couldn\'t be found');
      return null;
    }
    console.log('found newHeader in owned array');

    // check for availability of the new item
    if (!newItem.available) {
      console.log('You do not have enough of the new item to swap it into your plant');
      return null;
    }

    // new item found, increment newItem usage and decrement oldItem usage
    let updatedOwnedObject = this.storeController.decrementItemUsage('headers', oldIndex);
    if (updatedOwnedObject === null) return;

    updatedOwnedObject = this.storeController.incrementItemUsage('headers', newIndex);
    if (updatedOwnedObject === null) return;

    console.log('swapping header of plant');

    // updates PlantArray
    const newPlantItem: IPlantItem = { name: newItem.name };
    PlantBackend.plantArray[plantIndex].header = newPlantItem;

    // replace updated items into async
    this.storeController.setOwned(updatedOwnedObject);
    AsyncStorage.setItem('PlantArray', JSON.stringify(PlantBackend.plantArray))
    .then(() => {
      console.log('PlantArray array successfully updated after swapping header');
    });

    // returns the new header and owned array
    return{
      newHeader: PlantBackend.plantArray[plantIndex].header,
      promiseForOwned: this.storeController.getOwned(),
    };
  }

  /**
   * @returns null if failure, new header and owned array if success
   * @param plantIndex index of plant whose header we want to change
   * @param oldFooterName name of old footer item
   * @param newFooterName name of new footer item
   */
  public changeFooter(plantIndex: number = 0, oldFooterName: string, newFooterName: string) {
    // // initialize holders
    // let currentItem = null;
    // let oldItem = null;
    // let oldIndex = 0;

    // // find oldItem for later update
    // const tempOwnedArray: IOwned = this.storeController.getOwned();
    // for (let i = 0; i < tempOwnedArray.footers.length; i ++) {
    //   if (tempOwnedArray.footers[i].name === oldFooterName) {
    //     console.log('found old footer');
    //     oldItem = tempOwnedArray.footers[i];
    //     oldIndex = i;
    //   }
    // }

    // looks to see if the old item is currently in ownedObject
    const resultOfSearchingOldFooter = this.storeController.isItemAvailable('footers',
                                                                            oldFooterName);
    const oldItem = resultOfSearchingOldFooter.object;
    const oldIndex = resultOfSearchingOldFooter.index;

    if (oldItem === undefined || oldItem === null) {
      console.log('old item in plant couldn\'t be found');
      return null;
    }
    console.log('found oldFooter in owned array');

    // looks to see if the new item is currently in ownedObject
    const resultOfSearchingNewFooter = this.storeController.isItemAvailable('footers',
                                                                            newFooterName);
    const newItem = resultOfSearchingNewFooter.object;
    const newIndex = resultOfSearchingNewFooter.index;

    if (newItem === undefined || newItem === null) {
      console.log('new item in owned couldn\'t be found');
      return null;
    }
    console.log('found newFooter in owned array');

    // check for availability of the new item
    if (!newItem.available) {
      console.log('You do not have enough of the new item to swap it into your plant');
      return null;
    }

    // newItem found, increment newIOtem usage and decrement oldItem usage
    let updatedOwnedObject = this.storeController.decrementItemUsage('footers', oldIndex);
    if (updatedOwnedObject === null) return;

    updatedOwnedObject = this.storeController.incrementItemUsage('footers', newIndex);
    if (updatedOwnedObject === null) return;
    console.log('swapping footer of plant');

    // updates PlantArray
    const newPlantItem: IPlantItem = { name: newItem.name };
    PlantBackend.plantArray[plantIndex].footer = newPlantItem;

    // replace updated items into async
    this.storeController.setOwned(updatedOwnedObject);
    AsyncStorage.setItem('PlantArray', JSON.stringify(PlantBackend.plantArray))
    .then(() => {
      console.log('Plant array successfully updated');
    });

    return{
      newFooter: PlantBackend.plantArray[plantIndex].footer,
      promiseForOwned: this.storeController.getOwned(),
    };
  }

  /**
   * internal helper method that sets up a default plant array with
   * 1 header, body, and footer
   */
  private static createDefaultPlantArray() {
    const defaultPlantHeader = {
      name: PlantHeaders[0].name,
    };

    const defaultPlantBody = {
      name: PlantBodies[0].name,
    };

    const defaultPlantFooter = {
      name: PlantFooters[0].name,
    };

    const defaultPlant = {
      header : defaultPlantHeader,
      body : [defaultPlantBody],
      footer : defaultPlantFooter,
    };

    const fullPlantArray = [defaultPlant];
    const stringifiedPlant = JSON.stringify(fullPlantArray);

    AsyncStorage.setItem('PlantArray', stringifiedPlant)
    .then(() => {
      console.log('Successfully created default plant in async');
    });

    return fullPlantArray;
  }
}
