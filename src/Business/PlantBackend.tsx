import { AsyncStorage } from 'react-native';
import { bodies, footers, headers } from './itemProperties.tsx';

const PlantHelper = {

  createDefaultPlantArray: async () => {
    headers[0].owned = 1;
    headers[0].used = 1;
    headers[0].available = headers[0].owned > headers[0].used;

    bodies[0].owned = 1;
    bodies[0].used = 1;
    bodies[0].available = bodies[0].owned > bodies[0].used;

    footers[0].owned = 1;
    footers[0].used = 1;
    footers[0].available = footers[0].owned > footers[0].used;

    const defaultPlant = { header: headers[0], body: [bodies[0]], footer: footers[0] };

    const ownedValuesJson = await AsyncStorage.getItem('owned');
    const ownedValues = JSON.parse(ownedValuesJson || '[[], [], []]');
    ownedValues[0].push(footers[0]);
    ownedValues[1].push(bodies[0]);
    ownedValues[2].push(headers[0]);

    await AsyncStorage.setItem('owned', JSON.stringify(ownedValues));

    const temp = [defaultPlant];
    const tempJson = JSON.stringify(temp);
    await AsyncStorage.setItem('PlantArray', tempJson);
  },

  // CHECK IF PLANT HAS BEEN CREATED
  async getHeader(plantIndex: number) {
    const plantArrayJson = await AsyncStorage.getItem('PlantArray');
    const plantArray = JSON.parse(plantArrayJson);

    console.log(plantArray[plantIndex].header);
    return plantArray[plantIndex].header;
  },

  async getBody(plantIndex: number) {
    const plantArrayJson = await AsyncStorage.getItem('PlantArray');
    const plantArray = JSON.parse(plantArrayJson);

    console.log(plantArray[plantIndex].body);
    return plantArray[plantIndex].body;
  },

  async getFooter(plantIndex: number) {
    const plantArrayJson = await AsyncStorage.getItem('PlantArray');
    const plantArray = JSON.parse(plantArrayJson);

    console.log(plantArray[plantIndex].footer);
    return plantArray[plantIndex].footer
  },

  async changeHeader(oldName: string, newName: string, plantIndex: number) {
    console.log('changeHeader running');
    // get ownedArray
    let ownedArray = await AsyncStorage.getItem('owned');
    ownedArray = JSON.parse(ownedArray);
    // initialize holders
    let currentItem = null;
    let oldItem = null;
    let oldIndex = 0;

    // find oldItem for later update
    for (let i = 0; i < ownedArray[2].length; i++) {
      if (ownedArray[2][i].name === oldName) {
        console.log('found old header');
        oldItem = ownedArray[2][i];
        oldIndex = i;
      }
    }

    // find new item
    for (let i = 0; i < ownedArray[2].length; i++) {
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
        // update PlantArray
        var plantArray = await AsyncStorage.getItem('PlantArray');
        plantArray = JSON.parse(plantArray);
        plantArray[plantIndex].header = currentItem;

        await AsyncStorage.setItem('PlantArray', JSON.stringify(plantArray));

        return;
      }
    }
    console.log('new item not found');
  },

};

export default PlantHelper;
