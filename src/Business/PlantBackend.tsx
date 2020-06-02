import * as React from 'react';
import { AsyncStorage } from 'react-native';

import { PlantBodies,  PlantFooters, PlantHeaders } from '../../constants/Plants';
import StoreBackend, { IOwnedItem, IOwnedArray } from './StoreBackend';

export interface IPlantItem{
  name: string;
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


export default class PlantBackend extends React.Component<object, object> {
  private static readonly PLANT_ARRAY_KEY = 'PlantArray';
  private static instance: PlantBackend | null = null;
  private static plantArray: IPlant[];
  private storeController;

  private constructor(props: {}) {
    super(props);
    console.log('PlantController created!');

    // sets the storeController
    this.storeController = StoreBackend.getInstance();

    AsyncStorage.getItem('PlantArray').then((result) => {
      if (result === null) {
        PlantBackend.plantArray = PlantBackend.createDefaultPlantArray();
      } else {
        PlantBackend.plantArray = JSON.parse(result);
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

  public getPlantArray(){
    return PlantBackend.plantArray;
  }

  //updates plantItems when an item is bought
  public handlePlants(sectionName: string, item: IOwnedItem | null) {
    if(item === null){
      console.log("The item passed in is invalid, plant array has not been changed");
      return null;
    }
    //loops through all the plants the user owns
    for(let i = 0; i < PlantBackend.plantArray.length; i++) {
      let currentPlant = PlantBackend.plantArray[i];

      //we are looking at the footer array
      if (sectionName == "footers") {
        // we are currently using the bought item as a footer in the plant
        if (currentPlant.footer.name == item.name) {
          currentPlant.footer = item;
        }
      }
      //we are looking at the bodies array
      else if (sectionName == "bodies") {
        let bodyArray = currentPlant.body;
        for (let j = 0; j < bodyArray.length; j ++) {
          // we are currently using the bought item as a body in the plant
          let bodyItem = bodyArray[j]
          if (bodyItem.name == item.name) {
            bodyArray[j] = item;
            currentPlant.body = bodyArray;
          }
        }
      } 
      //we are looking at the headers array
      else if (sectionName == "headers") {
        // we are currently using the bought item as a header in the plant
        if (currentPlant.header.name == item.name) {
          currentPlant.header = item;
        }
      }

      // pushes all changes to the plant array
      PlantBackend.plantArray[i] = currentPlant;
    }
    // push plantArray
    AsyncStorage.setItem('PlantArray', JSON.stringify(PlantBackend.plantArray)).then(() => {
      console.log('The plant array has been updated after an item has been bought');
    });
    
  }


  public addBody(plantIndex: number = 0, newBodyName: string) {
    let tempOwnedArray:IOwnedArray = this.storeController.getOwnedArray();
    let itemIndex = 0;
    const item = tempOwnedArray.bodies.find( (itemToCheck:IOwnedItem, index:number) => {
      if(itemToCheck.name === newBodyName){
        itemIndex = index;
        return true;
      }return false
    });


    if (item === undefined) {
      console.log("you don't own this item");
      return null;
    }

    //checks if this item is available
    if(!item.available){
      console.log("You are trying to add a body when you don't hvae enough of it");
      return null;
    }
    // update item itself and puts the updated item back into owned array
    item.used++;
    item.available = item.owned > item.used;
    tempOwnedArray.bodies[itemIndex] = item;

    // add this item to the end of the body array and then update plantArray
    const currentPlant = PlantBackend.plantArray[plantIndex];
    currentPlant.body.push(item);
    PlantBackend.plantArray[plantIndex] = currentPlant;

    this.storeController.setOwnedArray(tempOwnedArray);

    AsyncStorage.setItem('PlantArray', JSON.stringify(PlantBackend.plantArray)).then(() => {
      console.log("Successfully updated plant array after adding body");
    });

    // returns the body of the plant and owned array
    return {
      newBody: PlantBackend.plantArray[plantIndex].body,
      newOwned: this.storeController.getOwnedArray(),
    };
  }

  //switches a body of the plant
  public changeBody(plantIndex: number = 0, oldPlantBodyIndex: number,
                    oldBodyName:string, newBodyName:string) {

    let oldItem = null;
    let oldIndex = 0;
    let newItem = null;

    // find oldItem for later update
    const tempOwnedArray = this.storeController.getOwnedArray();
    oldItem = tempOwnedArray.bodies.find( (element:IOwnedItem, index:number) => {
      if (element.name === oldBodyName){
        oldIndex = index;
        return true;
      }return false;
    })

    if(oldItem=== undefined || oldItem.used <= 0 ){
      console.log("item in plant couldn't be found")
      return null;
    }
    /*
    for (let i = 0; i < tempOwnedArray[ownedIndex].length; i ++) {
      if (tempOwnedArray[ownedIndex][i].name === oldBody.name) {
        console.log('found old bodyItem');
        oldItem = tempOwnedArray[ownedIndex][i];
        oldIndex = i;
      }
    }
    */

    for (let i = 0; i < tempOwnedArray.bodies.length; i ++) {
      if (tempOwnedArray.bodies[i].name === newBodyName) {
        console.log('found newBody in owned array');
        newItem = tempOwnedArray.bodies[i];
      }else{
        continue;
      }

      // check for availability
      if (!newItem.available) {
        console.log('You do not have enough of the new item to swap it into your plant');
        return null;
      }
      // the newItem has been found and is available
      newItem.used++;
      newItem.available = newItem.owned > newItem.used;
      oldItem.used--;
      oldItem.available = oldItem.owned > oldItem.used;

      console.log('swapping body of plant');
      tempOwnedArray.bodies[i] = newItem;
      tempOwnedArray.bodies[oldIndex] = oldItem;

      // update plantArray
      const currentPlant = PlantBackend.plantArray[plantIndex];
      currentPlant.body[oldPlantBodyIndex] = newItem;
      PlantBackend.plantArray[plantIndex] = currentPlant;

      // replace updated items into async
      this.storeController.setOwnedArray(tempOwnedArray);

      AsyncStorage.setItem('PlantArray', JSON.stringify(PlantBackend.plantArray)).then(() => {
        console.log('New item successfully swapped in plant body');
      });

      // returns the new body array and owned array
      return {
        newBody: PlantBackend.plantArray[plantIndex].body,
        newOwned: this.storeController.getOwnedArray(),
      };
    }
    console.log("The item u are trying to add into your plant cannot be found")
    return null;
  }

  // CHECK IF PLANT HAS BEEN CREATED
  public getHeader(plantIndex: number = 0) {
    if(PlantBackend.plantArray != null){
      console.log('The plant header is: ' + PlantBackend.plantArray[plantIndex].header);
      return PlantBackend.plantArray[plantIndex].header;
    }
    console.log("The plant array does not exist yet")
    return null;
  }

  public getBody(plantIndex: number = 0) {
    if(PlantBackend.plantArray != null){
      console.log('The plant body is: ' + PlantBackend.plantArray[plantIndex].body);
      return PlantBackend.plantArray[plantIndex].body;
    }
    console.log("The plant array does not exist yet")
    return null;
  }

  public getFooter(plantIndex: number = 0) {
    if(PlantBackend.plantArray != null){
      console.log('The plant footer is: ' + PlantBackend.plantArray[plantIndex].footer);
      return PlantBackend.plantArray[plantIndex].footer
    }
    console.log("The plant array does not exist yet")
    return null;
  }

  public changeHeader(plantIndex: number = 0, oldHeaderName:string,
                      newHeaderName:string ) {

    // initialize holders
    let currentItem = null;
    let oldItem = null;
    let oldIndex = 0;

    // find oldItem for later update
    let tempOwnedArray:IOwnedArray = this.storeController.getOwnedArray();
    for (let i = 0; i < tempOwnedArray.headers.length; i ++) {
      if (tempOwnedArray.headers[i].name === oldHeaderName) {
        console.log('found old header');
        oldItem = tempOwnedArray.headers[i];
        oldIndex = i;
      }
    }

    if(oldItem === null){
      return null;
    }
    // find new item
    for (let i = 0; i < tempOwnedArray.headers.length; i ++) {
      console.log(tempOwnedArray.headers[i].name + "    " + newHeaderName)
      if (tempOwnedArray.headers[i].name === newHeaderName) {
        currentItem = tempOwnedArray.headers[i];
        if (!currentItem.available) {
          console.log('You do not have enough of this header item.');
          return null;
        }
        // update currentItem and oldItem properties
        currentItem.used++;
        currentItem.available = currentItem.owned > currentItem.used;
        oldItem.used--;
        oldItem.available = oldItem.owned > oldItem.used;

        console.log('swapping header of plant');
        tempOwnedArray.headers[i] = currentItem;
        tempOwnedArray.headers[oldIndex] = oldItem;


        // updates PlantArray
        PlantBackend.plantArray[plantIndex].header = currentItem;

        // replace updated items into async
        this.storeController.setOwnedArray(tempOwnedArray);
        AsyncStorage.setItem('PlantArray', JSON.stringify(PlantBackend.plantArray)).then(
          () => {
            console.log('PlantArray array successfully updated after swapping header');
          },
        );

        // returns the new header and owned array
        return{
          newHeader: PlantBackend.plantArray[plantIndex].header,
          newOwned: this.storeController.getOwnedArray(),
        };

      }
    }
    console.log('new item not found');
  }

  public changeFooter(plantIndex: number = 0, oldFooterName: string,
                      newFooterName:string ) {
    // initialize holders
    let currentItem = null;
    let oldItem = null;
    let oldIndex = 0;

    // find oldItem for later update
    let tempOwnedArray:IOwnedArray = this.storeController.getOwnedArray();
    for (let i = 0; i < tempOwnedArray.footers.length; i ++) {
      if (tempOwnedArray.footers[i].name === oldFooterName) {
        console.log('found old footer');
        oldItem = tempOwnedArray.footers[i];
        oldIndex = i;
      }
    }

    if(oldItem === null){
      return null;
    }
    // find new item
    for (let i = 0; i < tempOwnedArray.footers.length; i ++) {
      if (tempOwnedArray.footers[i].name === newFooterName) {
        currentItem = tempOwnedArray.footers[i];
        if (!currentItem.available) {
          console.log('You do not have enough of this footer item.');
          return null;
        }
        // update currentItem and oldItem properties
        currentItem.used++;
        currentItem.available = currentItem.owned > currentItem.used;
        oldItem.used--;
        oldItem.available = oldItem.owned > oldItem.used;

        console.log('swapping footer of plant');
        tempOwnedArray.footers[i] = currentItem;
        tempOwnedArray.footers[oldIndex] = oldItem;


        // updates PlantArray
        PlantBackend.plantArray[plantIndex].footer = currentItem;

        // replace updated items into async
        this.storeController.setOwnedArray(tempOwnedArray);
        AsyncStorage.setItem('PlantArray', JSON.stringify(PlantBackend.plantArray)).then(
          () => {
            console.log('Plant array successfully updated');
          }
        );

        return{
          newFooter: PlantBackend.plantArray[plantIndex].footer,
          newOwned: this.storeController.getOwnedArray(),
        };

      }
    }
    console.log('new item not found');
  }

  private static createDefaultPlantArray() {
    const defaultPlantHeader = {
      name: PlantHeaders[0].name,
      owned: 1,
      used: 1,
      available: false
    };

    const defaultPlantBody = {
      name: PlantBodies[0].name,
      owned: 1,
      used: 1,
      available: false
    };

    const defaultPlantFooter = {
      name: PlantFooters[0].name,
      owned: 1,
      used: 1,
      available: false
    };

    const defaultPlant = { header : defaultPlantHeader, body : [defaultPlantBody], footer : defaultPlantFooter};

    const fullPlantArray = [defaultPlant];
    const stringifiedPlant = JSON.stringify(fullPlantArray);

    AsyncStorage.setItem('PlantArray', stringifiedPlant).then(() => {
      console.log("Successfully created default plant in async");
    });

    return fullPlantArray;
  }
}
