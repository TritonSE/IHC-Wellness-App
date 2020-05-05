import {AsyncStorage } from 'react-native';
import {footers, bodies, headers} from './itemProperties.tsx';
import { BaseItemAnimator } from 'recyclerlistview';

const plantHelper = {

  createDefaultPlantArray : async ()=> {
    headers[0].owned = 1;
    headers[0].used = 1;
    headers[0].available = headers[0].owned > headers[0].used;

    bodies[0].owned = 1;
    bodies[0].used = 1;
    bodies[0].available = bodies[0].owned > bodies[0].used;

    footers[0].owned = 1;
    footers[0].used = 1;
    footers[0].available = footers[0].owned > footers[0].used;

    var defaultPlant = {"header" : headers[0], "body" : [bodies[0]], "footer" : footers[0]}

    var ownedValues = await AsyncStorage.getItem('owned');
    ownedValues = JSON.parse(ownedValues)
    ownedValues[0].push(footers[0])
    ownedValues[1].push(bodies[0])
    ownedValues[2].push(headers[0])

    await AsyncStorage.setItem("owned", JSON.stringify(ownedValues));

    var temp = [defaultPlant]


    temp = JSON.stringify(temp)
    await AsyncStorage.setItem("PlantArray", temp)

    return temp
  },

  addBody : async function(plantIndex, newBody) {
    var ownedIndex = 1;
    var ownedArray = await AsyncStorage.getItem("owned")
    ownedArray = JSON.parse(ownedArray)

    // loop through the body section of the ownedArray to find newBody
    for (var i = 0; i < ownedArray[ownedIndex].length; i ++) {
      if (ownedArray[ownedIndex][i].name == newBody) {
        console.log("found body")
        item = ownedArray[ownedIndex][i]

        //check for availability
        if (!item.available) {
          console.log("you don't own this item")
          return
        } else {

          // update item itself and dump it into ownedArray
          item.used++;
          item.available = item.owned > item.used
          ownedArray[ownedIndex][i] = item
          await AsyncStorage.setItem("owned", JSON.stringify(ownedArray))



          // add this item to the end of the body array and dump it into plantArray
          var plantArray = await AsyncStorage.getItem("PlantArray")
          plantArray = JSON.parse(plantArray)
          var currentPlant = plantArray[plantIndex]
          currentPlant.body.push(item)
          plantArray[plantIndex] = currentPlant
          await AsyncStorage.setItem("PlantArray", JSON.stringify(plantArray))
          return item
        }
      }
    }
  },

  //oldPlantIndex = the index we want to swap the body part of
  changeBody : async function(plantIndex, oldName, oldPlantIndex, newName) {
    var ownedIndex = 1;
    var ownedArray = await AsyncStorage.getItem("owned")
    ownedArray = JSON.parse(ownedArray)

    var oldItem = null
    var oldIndex = 0;
    var item = null;

    // find oldItem for later update
    for (var i = 0; i < ownedArray[ownedIndex].length; i ++) {
      if (ownedArray[ownedIndex][i].name == oldName) {
        console.log("found old bodyItem")
        oldItem = ownedArray[ownedIndex][i]
        oldIndex = i;
      }
    }
    for (var i = 0; i < ownedArray[ownedIndex].length; i ++) {
      if (ownedArray[ownedIndex][i].name == newName) {
        console.log("found newBody")
        item = ownedArray[ownedIndex][i]
      }
    }
    //check for availability
    if (item == null || !item.available) {
      console.log("you don't own enough of this item")
      return
    } else {
      // we've found newItem
      item.used++;
      item.available = item.owned > item.used
      oldItem.used--;
      oldItem.available = oldItem.owned > oldItem.used

      console.log("swap")
      ownedArray[ownedIndex][i] = item
      ownedArray[ownedIndex][oldIndex] = oldItem

      // replace updated items into async
      await AsyncStorage.setItem("owned", JSON.stringify(ownedArray))

      // update plantArray
      var plantArray = await AsyncStorage.getItem("PlantArray")
      plantArray = JSON.parse(plantArray)
      var currentPlant = plantArray[plantIndex]
      currentPlant.body[oldPlantIndex] = item
      plantArray[plantIndex] = currentPlant
      await AsyncStorage.setItem("PlantArray", JSON.stringify(plantArray))

    }

  },

  //CHECK IF PLANT HAS BEEN CREATED
  getHeader : async function(plantIndex) {

    var plantArray = await AsyncStorage.getItem("PlantArray")
    plantArray = JSON.parse(plantArray)
    console.log(plantArray[plantIndex].header)

    //return plantArray[plantIndex].header
  },

  getBody : async function(plantIndex) {
    var plantArray = await AsyncStorage.getItem("PlantArray")
    plantArray = JSON.parse(plantArray)
    console.log(plantArray[plantIndex].body)

    //return plantArray[plantIndex].body
  },

  getFooter : async function(plantIndex) {
    var plantArray = await AsyncStorage.getItem("PlantArray")
    plantArray = JSON.parse(plantArray)
    console.log(plantArray[plantIndex].footer)

    //return plantArray[plantIndex].footer
  },

  changeHeader : async function(oldName, newName, plantIndex) {
    console.log("running")
    // get ownedArray
    var ownedArray = await AsyncStorage.getItem("owned")
    ownedArray = JSON.parse(ownedArray)
    // initialize holders
    var currentItem = null
    var oldItem = null
    var oldIndex = 0;

    // find oldItem for later update
    for (var i = 0; i < ownedArray[2].length; i ++) {
      if (ownedArray[2][i].name == oldName) {
        console.log("found old header")
        oldItem = ownedArray[2][i]
        oldIndex = i;
      }
    }

    // find new item
    for (var i = 0; i < ownedArray[2].length; i ++) {
      console.log(newName)
      console.log(ownedArray[2][i].name)
      if (ownedArray[2][i].name == newName) {
        currentItem = ownedArray[2][i]
        if (!currentItem.available) {
          console.log("You do not have enough of this header item.")
          return
        } else {
          // update currentItem and oldItem properties
          currentItem.used++;
          currentItem.available = currentItem.owned > currentItem.used
          oldItem.used--;
          oldItem.available = oldItem.owned > oldItem.used

          console.log("swap")
          ownedArray[2][i] = currentItem
          ownedArray[2][oldIndex] = oldItem

          // replace updated items into async
          await AsyncStorage.setItem("owned", JSON.stringify(ownedArray))
          //updates PlantArray
          var plantArray = await AsyncStorage.getItem("PlantArray")
          plantArray = JSON.parse(plantArray)
          plantArray[plantIndex].header = currentItem

          await AsyncStorage.setItem("PlantArray", JSON.stringify(plantArray))

          return

        }
      }
    }
    console.log("new item not found")
  },

  changeFooter : async function(oldName, newName, plantIndex) {
    // get ownedArray
    var ownedArray = await AsyncStorage.getItem("owned")
    ownedArray = JSON.parse(ownedArray)
    // initialize holders
    var currentItem = null
    var oldItem = null
    var oldIndex = 0;

    // find oldItem for later update
    var ownedIndex = 0;
    for (var i = 0; i < ownedArray[ownedIndex].length; i ++) {
      if (ownedArray[ownedIndex][i].name == oldName) {
        console.log("found old footer")
        oldItem = ownedArray[ownedIndex][i]
        oldIndex = i;
      }
    }

    // find new item
    for (var i = 0; i < ownedArray[ownedIndex].length; i ++) {
      console.log(newName)
      console.log(ownedArray[ownedIndex][i].name)
      if (ownedArray[ownedIndex][i].name == newName) {
        currentItem = ownedArray[ownedIndex][i]
        if (!currentItem.available) {
          console.log("You do not have enough of this footer item.")
          return
        } else {
          // update currentItem and oldItem properties
          currentItem.used++;
          currentItem.available = currentItem.owned > currentItem.used
          oldItem.used--;
          oldItem.available = oldItem.owned > oldItem.used

          console.log("swap")
          ownedArray[ownedIndex][i] = currentItem
          ownedArray[ownedIndex][oldIndex] = oldItem

          // replace updated items into async
          await AsyncStorage.setItem("owned", JSON.stringify(ownedArray))
          //updates PlantArray
          var plantArray = await AsyncStorage.getItem("PlantArray")
          plantArray = JSON.parse(plantArray)
          plantArray[plantIndex].footer = currentItem

          await AsyncStorage.setItem("PlantArray", JSON.stringify(plantArray))

          return

        }
      }
    }
    console.log("new item not found")
  },


}

export default plantHelper
