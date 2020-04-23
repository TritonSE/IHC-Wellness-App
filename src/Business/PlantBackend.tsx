import { AsyncStorage } from 'react-native';
import { bodies, footers, headers } from './itemProperties.tsx';

const plantHelper = {

  createDefaultPlantArray : async () => {
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

    let ownedValues = await AsyncStorage.getItem('owned');
    ownedValues = JSON.parse(ownedValues);
    ownedValues[0].push(footers[0]);
    ownedValues[1].push(bodies[0]);
    ownedValues[2].push(headers[0]);

    await AsyncStorage.setItem('owned', JSON.stringify(ownedValues));

    let temp = [defaultPlant];

    temp = JSON.stringify(temp);
    await AsyncStorage.setItem('PlantArray', temp);

  },

  async addBody (plantIndex, newBody) {
    const ownedIndex = 1;
    let ownedArray = await AsyncStorage.getItem('owned');
    ownedArray = JSON.parse(ownedArray);

        // loop through the body section of the ownedArray to find newBody
    for (let i = 0; i < ownedArray[ownedIndex].length; i ++) {
      if (ownedArray[ownedIndex][i].name === newBody) {
        console.log('found body');
        const item = ownedArray[ownedIndex][i];

        // check for availability
        if (!item.available) {
          console.log("you don't own this item");
          return;
        }

        // update item itself and dump it into ownedArray
        item.used++;
        item.available = item.owned > item.used;
        ownedArray[ownedIndex][i] = item;
        await AsyncStorage.setItem('owned', JSON.stringify(ownedArray));

        // add this item to the end of the body array and dump it into plantArray
        let plantArray = await AsyncStorage.getItem('PlantArray');
        plantArray = JSON.parse(plantArray);
        let currentPlant = plantArray[plantIndex];
        currentPlant.body.push(item);
        plantArray[plantIndex] = currentPlant;
        await AsyncStorage.setItem('PlantArray', JSON.stringify(plantArray));

      }
    }
  },

  async changeBody (plantIndex, oldName, oldPlantIndex, newName) {
    const ownedIndex = 1;
    let ownedArray = await AsyncStorage.getItem('owned');
    ownedArray = JSON.parse(ownedArray);
    let oldItem = null;
    let oldIndex = 0;

        // find oldItem for later update
    for (let i = 0; i < ownedArray[ownedIndex].length; i ++) {
      if (ownedArray[ownedIndex][i].name == oldName) {
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
  },

  // CHECK IF PLANT HAS BEEN CREATED
  async getHeader (plantIndex) {

    let plantArray = await AsyncStorage.getItem('PlantArray');
    plantArray = JSON.parse(plantArray);
    console.log(plantArray[plantIndex].header);

    // return plantArray[plantIndex].header
  },

  async getBody (plantIndex) {
    let plantArray = await AsyncStorage.getItem('PlantArray');
    plantArray = JSON.parse(plantArray);
    console.log(plantArray[plantIndex].body);

    // return plantArray[plantIndex].body
  },

  async getFooter (plantIndex) {
    let plantArray = await AsyncStorage.getItem('PlantArray');
    plantArray = JSON.parse(plantArray);
    console.log(plantArray[plantIndex].footer);

    // return plantArray[plantIndex].footer
  },

  async changeHeader (oldName, newName, plantIndex) {
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
      if (ownedArray[2][i].name == oldName) {
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
  },

  async changeFooter (oldName, newName, plantIndex) {
          // get ownedArray
    let ownedArray = await AsyncStorage.getItem('owned');
    ownedArray = JSON.parse(ownedArray);

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
  },

};

export default plantHelper;
