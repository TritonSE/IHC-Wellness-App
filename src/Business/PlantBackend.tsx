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

  public savePlantSection(sectionName: string, section: IPlantItem | IPlantItem[], plantIndex = 0) {
    if (sectionName !== 'headers' && sectionName !== 'bodies' && sectionName !== 'footers') {
      throw new Error('A valid section name was not passed in. Must be \'headers\', \'bodies\', or \'footers\'');
    }
    const plantSection = sectionName === 'headers' ? header : sectionName === 'bodies' ? 'body' : 'footer';
    PlantBackend.plantArray[plantIndex][plantSection] = section;
    AsyncStorage.setItem('PlantArray', JSON.stringify(PlantBackend.plantArray));

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
   * @returns null if failure, new header and owned array if success
   * @param plantIndex index of plant whose header we want to change
   * @param oldHeaderName name of oldheader item
   * @param newHeaderName name of new header item
   */
  public swapHeader(oldHeaderName: string, newHeaderName: string) {
    // Change bodies to use new item at specified index
    const newHeader = { name: newHeaderName };

    const oldHeaderOwnedIndex = this.storeController.isItemAvailable('headers', oldHeaderName).index;
    const newHeaderOwnedIndex = this.storeController.isItemAvailable('headers', newHeaderName).index;

    let ownedObject = this.storeController.decrementItemUsage('headers', oldHeaderOwnedIndex);
    ownedObject = this.storeController.incrementItemUsage('headers', newHeaderOwnedIndex);

    return {
      header: newHeader,
      ownedHeaders: ownedObject.headers,
    };
  }

  /**
   * Swaps out a body item in the plant's body array
   * @param bodies array of plant bodies to update
   * @param plantIndex which plant to update
   * @param oldBodyName name of that old body item
   * @param newBodyName name of the new body item
   * @returns: null if item is invalid
   *           else returns the new body and owned arrays
   */
  public swapBody(bodies: IPlantItem[], oldBodyIndex: number, newBodyName: string) {
    // Change bodies to use new item at specified index
    const oldBodyName = bodies[oldBodyIndex].name;
    const newBodies: IPlantItem[] = [...bodies];
    newBodies[oldBodyIndex].name = newBodyName;

    const oldBodyOwnedIndex = this.storeController.isItemAvailable('bodies', oldBodyName).index;
    const newBodyOwnedIndex = this.storeController.isItemAvailable('bodies', newBodyName).index;

    let ownedObject = this.storeController.decrementItemUsage('bodies', oldBodyOwnedIndex);
    ownedObject = this.storeController.incrementItemUsage('bodies', newBodyOwnedIndex);

    return {
      bodies: newBodies,
      ownedBodies: ownedObject.bodies,
    };
  }

  /**
   * @returns null if failure, new header and owned array if success
   * @param plantIndex index of plant whose header we want to change
   * @param oldFooterName name of old footer item
   * @param newFooterName name of new footer item
   */
  public swapFooter(oldFooterName: string, newFooterName: string) {
    // Change bodies to use new item at specified index
    const newFooter = { name: newFooterName };

    const oldFooterOwnedIndex = this.storeController.isItemAvailable('footers', oldFooterName).index;
    const newFooterOwnedIndex = this.storeController.isItemAvailable('footers', newFooterName).index;

    let ownedObject = this.storeController.decrementItemUsage('footers', oldFooterOwnedIndex);
    ownedObject = this.storeController.incrementItemUsage('footers', newFooterOwnedIndex);

    return {
      footer: newFooter,
      ownedFooters: ownedObject.footers,
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
