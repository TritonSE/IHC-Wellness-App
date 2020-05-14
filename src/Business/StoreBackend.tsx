import { AsyncStorage } from 'react-native';

import { PlantBodies, PlantHeaders, PlantFooters, IStoreItem } from '../../constants/Plants';

// Inherits name and price from IStoreItem
export interface IOwnedItem extends IStoreItem {
  owned: number;
  used: number;
  available: boolean;
}

// TODO convert to singleton, members are money and ownedArrays
const StoreBackend = {
  // private money: number = 0;
  // If it is easier you can change this back to an array, but an object
  // with named keys might be easier as sectionName parameters can be
  // directly used as a key to access an array
  /*
  private ownedArrays: {
    headers: IOwnedItem[],
    bodies: IOwnedItem[],
    footers: IOwnedItem[],
  } | null = null;
  */

    // TODO fix names or logic in functions like these, it is called addMoney
    // but it is really setting money
    // Methods should be getMoney() (getter), addMoney() (that increases money)
    // and spendMoney() (that reduces money)
    addMoney: async function(amount: number) {
      await AsyncStorage.setItem("Money", amount.toString());
      return amount
    },

    createDefaultOwnedArrays: async function(){
      // TODO refactor to use constants/Plants.ts instead of headers, bodies, footers
      // Below is an example of how to use the map higher order function to get an
      // IOwnedItem[] array from IStoreItem[] array
      let ownedPlantHeaders: IOwnedItem[] = PlantHeaders.map((header: IStoreItem) => {
        return {
          ...header,
          owned: 0,
          used: 0,
          available: false,
        };
      });

      // TODO replace all var keywords with let, const is even better if value does not change
      var item = [[],[],[]];
      item = JSON.stringify(item);
      await AsyncStorage.setItem("owned", item);
      return item;
    },

    // takes in an item and updates it and its owned and available fields in all owned array in async
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

    // TODO replace var with let, let that doesn't change with const, double == with triple ===
    // TODO as this functions Updates the plant, move it to PlantBackend
    // Also, rename functions named like this to be clearer: handle doesn't describe what change
    // is happening, replace handle with a verb that describes the update (swap, add, delete etc.)
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
          StoreBackend.createDefaultOwnedArrays();
        }

        //add onto the previous array
        let asyncValue = StoreBackend.getAllItems();

        var found = false
        //gets the index of the section
        var sectionIndex = StoreBackend.getListIndex(section);

        //looks for the item in a certain section
        for(var i = 0; i < asyncValue[sectionIndex].length; i++){
          //item was found
          if(asyncValue[sectionIndex][i].name == item){
            found = true
            //adds to owned array
            newItem = await StoreBackend.handleOwned(asyncValue[sectionIndex][i],sectionIndex)

            var plantArray = await AsyncStorage.getItem("PlantArray")
            plantArray = JSON.parse(plantArray);

            StoreBackend.handlePlants(newItem, plantArray, section)

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
      let asyncValue = StoreBackend.getAllItems();
      //adds the Item array
      var sectionIndex = StoreBackend.getListIndex(list);

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

export default StoreBackend;
