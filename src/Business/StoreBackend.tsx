import { AsyncStorage } from 'react-native';
import {footers, bodies, headers} from './itemProperties.tsx';

const storeHelper = {
    getFooters : function() {
        return footers;
    },

    getBodies : function() {
        return bodies;
    },

    getHeaders : function() {
        return headers;
    },

    getAllItems : function(){
      var allItems = [];
      allItems[0] = footers;
      allItems[1] = bodies;
      allItems[2] = headers;
      return allItems;
    },



    addMoney: async function(amount: float) {
      await AsyncStorage.setItem("Money", amount.toString());
      return amount
    },

    createOwned: async function(){
      var item = [[],[],[]];
      item = JSON.stringify(item);
      await AsyncStorage.setItem("owned", item);
    },

    //takes in an item and updates it and its owned and available fields in all owned array in async
    handleOwned: async function(item, sectionIndex){
      var ownedArray = await AsyncStorage.getItem("owned");
      ownedArray = JSON.parse(ownedArray);
      var indexOwnedArray = ownedArray[sectionIndex];
      var found = false;

      for(var i = 0; i < indexOwnedArray.length; i++){
        //update item
        if(indexOwnedArray[i].name == item.name){
          item.owned++;
          item.available = item.owned > item.used;
          indexOwnedArray[i] = item
          found = true
        }
      }
      //if not owned yet
      if(!found){
        item.owned = 1;
        item.used = 0;
        item.available = item.owned > item.used;
        indexOwnedArray.push(item);
      }
      ownedArray[sectionIndex] = indexOwnedArray;
      ownedArray = JSON.stringify(ownedArray)
      await AsyncStorage.setItem("owned", ownedArray)

      return item;
    },

    handlePlants: async function(item, plantArray, section) {
      for(var i = 0; i < plantArray.length; i++) {
        var currentPlant = plantArray[i]


        if (section == "footers") {
          // footer
          if (currentPlant.footer.name == item.name) {
            // we are currently using the bought item as a footer in the plant

            currentPlant.footer = item
          }
        } else if (section == "bodies") {
          var bodyArray = currentPlant.body
          for (var j = 0; j < bodyArray.length; j ++) {

            var bodyItem = bodyArray[j]
            console.log("Body:" + bodyItem.name)
            console.log("Item:" + item.name)
            if (bodyItem.name == item.name) {
              bodyArray[j] = item
              currentPlant.body = bodyArray
            }
          }

        } else if (section == "headers") {
          if (currentPlant.header.name == item.name) {
            currentPlant.header = item
          }
        }
        plantArray[i] = currentPlant;
      }
      // push plantArray
      await AsyncStorage.setItem("PlantArray", JSON.stringify(plantArray))
    },

    buyItem: async function(item: string, section) {
        let newItem = null;
        let ownedValue = await AsyncStorage.getItem("owned");

        //create owned array if doesn't exist already
        if(ownedValue == null){
          console.log('created')
          storeHelper.createOwned();
        }

        //add onto the previous array
        let asyncValue = storeHelper.getAllItems();

        var found = false
        //gets the index of the section
        var sectionIndex = storeHelper.getListIndex(section);

        //looks for the item in a certain section
        for(var i = 0; i < asyncValue[sectionIndex].length; i++){
          //item was found
          if(asyncValue[sectionIndex][i].name == item){
            found = true
            //adds to owned array
            newItem = await storeHelper.handleOwned(asyncValue[sectionIndex][i],sectionIndex)

            var plantArray = await AsyncStorage.getItem("PlantArray")
            plantArray = JSON.parse(plantArray);

            storeHelper.handlePlants(newItem, plantArray, section)

            var balance = await AsyncStorage.getItem("Money")
            balance = parseInt(balance, 10)
            var cost = asyncValue[i].price
            if (balance < cost) {
              console.log("broke")
              return
            } else {
              balance -= cost
              await AsyncStorage.setItem("Money", balance.toString())
            }
          }
        }

        //item was not found, so create a new instance
        if(!found){
          alert("You are trying to buy an item that doesn't exist");
        }else{
          return newItem
        }
    },

    getItemInfo: async(item, list)=>{
      let temp = null;
      let asyncValue = storeHelper.getAllItems();
      //adds the Item array
      var sectionIndex = storeHelper.getListIndex(list);

      for(var i = 0; i < asyncValue[sectionIndex].length; i++){
        //item was found
        if(asyncValue[sectionIndex][i].name == item){
          temp = asyncValue[sectionIndex][i];
        }
      }
      //looks for this item in all owned and
      var ownedArray = await AsyncStorage.getItem("owned");
      ownedArray = JSON.parse(ownedArray);
      var indexOwnedArray = ownedArray[sectionIndex];
      for(var i = 0; i < indexOwnedArray.length; i++){
        if(indexOwnedArray[i].name == item){
          return indexOwnedArray[i]
        }
      }

      //item not owned yet so return hardcoded 0
      temp.owned = 0;
      temp.available = false;
      temp.used = 0;
      return temp;

    },

    getListIndex: (section)=>{
      switch(section){
        case "footers":
          return 0;
        case "bodies":
          return 1;
        case "headers":
          return 2;
      }
    },
}

export default storeHelper
