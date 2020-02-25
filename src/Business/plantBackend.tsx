import {AsyncStorage } from 'react-native';
import {pots, stems, flowers} from './itemProperties.tsx';

const plantHelper = {
    
    createDefaultPlantArray : async ()=> {
        
        var defaultPlant = {"header" : flowers[0], "body" : [stems[0]], "footer" : pots[0]}
        
        var temp = [defaultPlant]
         
         temp = JSON.stringify(temp)
        await AsyncStorage.setItem("PlantArray", temp)

    },
    
    
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

    changeHeader : async function(oldName, newName) {
        // get ownedArray
        var ownedArray = await AsyncStorage.getItem("owned")
        ownedArray = JSON.parse(ownedArray)

        // initialize holders
        var currentItem = null
        var oldItem = null
        var oldIndex = 0;

        // find oldItem for later update
        for (var i = 0; i < ownedArray?.length; i ++) {
            if (ownedArray[i].name == oldName) {
                oldItem = ownedArray[i]
                oldIndex = i;
            }
        }

        // find new item
        for (var i = 0; i < ownedArray.length; i ++) {
            if (ownedArray[i].name == newName) {
                currentItem = ownedArray[i]
                if (!currentItem.available) {
                    console.log("You do not have enough of this header item.")
                    return
                } else {
                    // update currentItem and oldItem properties
                    currentItem.used++;
                    currentItem.available = currentItem.owned > currentItem.used
                    oldItem.used--;
                    oldItem.available = oldItem.owned > oldItem.used
                    
                    ownedArray[newIndex] = currentItem
                    ownedArray[oldIndex] = oldItem

                    // replace updated items into async
                    await AsyncStorage.setItem("owned", JSON.stringify(ownedArray))

                }
            }
        }
    }
    
    
}

export default plantHelper
