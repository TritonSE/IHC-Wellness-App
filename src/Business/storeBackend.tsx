import { AsyncStorage, ProgressViewIOSComponent } from 'react-native';
import { string } from 'prop-types';
import {pots, stems, flowers} from './itemProperties.tsx';

const storeHelper = {
    metadataCount : 2,
    storeMatrix : [ ["pots", 5, "terracotta", "plastic", "mud", "clay", "styrofoam"],
                        ["stems", 5, "long", "short", "medium", "yellow", "green"],
                        ["flowers", 5, "rose", "tulip", "daisy", "sunflower", "rose2"]],

    getPots : function() {
        return this.storeMatrix[0]
    },

    getStems : function() {
        return this.storeMatrix[1]
    },

    getFlowers : function() {
        return this.storeMatrix[2]
    },

    getAllItems : function(){
        return storeHelper.splicePots().concat(storeHelper.spliceStems()).concat(storeHelper.spliceFlowers())
    },

    splicePots : function() {
        return this.storeMatrix[0].slice(this.metadataCount)
    },
    spliceStems : function() {
        return this.storeMatrix[1].slice(this.metadataCount)
    },
    spliceFlowers : function() {
        return this.storeMatrix[2].slice(this.metadataCount)
    },


    addMoney: async function(amount: float) {
      await AsyncStorage.setItem("Money", amount.toString());

    },

    loadItems: async function(){
      let asyncValue = await AsyncStorage.getItem("storeItems");

      //initializes default values
      var potsArray = pots;
      var stemsArray = stems;
      var flowersArray = flowers;
      for(var i = 0; i < pots.length; i++){
        potsArray[i].owned = 0;
        potsArray[i].index = i;
      }
      for(var i = 0; i < stems.length; i++){
        stemsArray[i].owned = 0;
        stemsArray[i].index = i;
      }
      for(var i = 0; i < flowers.length ; i++){
        flowersArray[i].owned = 0;
        flowersArray[i].index = i;
      }

      //sets the item array in AsyncStorage to hold all items
      if(asyncValue == null){
        var items = [pots,stems,flowers];
        await AsyncStorage.setItem("storeItems", JSON.stringify(items))
      }
    },

    buyItem: async function(item: string, section) {

        let asyncValue = await AsyncStorage.getItem("storeItems");
        let ownedValue = await AsyncStorage.getItem("owned");
        //adds the Item array
        if(asyncValue == null){
            await storeHelper.loadItems();
            asyncValue = await AsyncStorage.getItem("storeItems");
        }
        //create owned arrray if doesn't exist already
        if(ownedValue == null){
          storeHelper.createOwned();
        }

        //add onto the previous array
        asyncValue = JSON.parse(asyncValue)

        var found = false
        //gets the index of the section
        var sectionIndex = storeHelper.getListIndex(section);

        //looks for the item in a certain section
        for(var i = 0; i < asyncValue[sectionIndex].length; i++){
          //item was found
          if(asyncValue[sectionIndex][i].name == item){
            found = true
            //updates the amount the user owns
            asyncValue[sectionIndex][i].owned = asyncValue[sectionIndex][i].owned + 1
            //adds to owned array
            storeHelper.handleOwned(asyncValue[sectionIndex][i],sectionIndex)
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

            //updates asyncstorage to reflect changes
            var stringified = JSON.stringify(asyncValue);
            AsyncStorage.setItem("storeItems",stringified);
          }
        }

        //item was not found, so create a new instance
        if(!found){
          alert("You are trying to buy an item that doesn't exist");
        }
    },

    getListIndex: (section)=>{
      switch(section){
        case "pots":
          return 0;
        case "stems":
          return 1;
        case "flowers":
          return 2;
      }
    },

    getItemInfo: async(item, list)=>{

      let asyncValue = await AsyncStorage.getItem("storeItems");
      //adds the Item array
      if(asyncValue == null){
        await storeHelper.loadItems();
        asyncValue = await AsyncStorage.getItem("storeItems");
      }
      asyncValue = JSON.parse(asyncValue)
      var sectionIndex = storeHelper.getListIndex(list);


      for(var i = 0; i < asyncValue[sectionIndex].length; i++){
        //item was found
        if(asyncValue[sectionIndex][i].name == item){
          return asyncValue[sectionIndex][i];
        }
      }
      return "not found"

    },


    createOwned: async function(){
      console.log("created")
      var item = [[],[],[]];
      item = JSON.stringify(item);
      await AsyncStorage.setItem("owned", item);
    },

    handleOwned: async function(item, sectionIndex){
      var ownedArray = await AsyncStorage.getItem("owned");
      ownedArray = JSON.parse(ownedArray);
      var indexOwnedArray = ownedArray[sectionIndex];

      var found = false;
      for(var i = 0; i < indexOwnedArray.length; i++){
        //update item
        if(indexOwnedArray[i].name == item.name){
          indexOwnedArray[i] = item
          found = true
        }
      }
      //if not owned yet
      if(!found){
        indexOwnedArray.push(item);
      }
      ownedArray[sectionIndex]  = indexOwnedArray;
      ownedArray = JSON.stringify(ownedArray)
      await AsyncStorage.setItem("owned", ownedArray)
    },


    getItems : async () => {
          var allItems = storeHelper.splicePots().concat(storeHelper.spliceStems()).concat(storeHelper.spliceFlowers())
          var ownedItems;
          try{//gets the list of all the items the user has
            ownedItems = await AsyncStorage.getItem("Items");
            if(ownedItems == null){
              alert("You do not own any items");
              return
            }
            ownedItems = JSON.parse(ownedItems);
          }
          catch(error){//user does not have an items array
            alert("You do not own any items");
            return
          }
          //looks for each item
          for(var i = 0; i < allItems.length; i++){
            //loops through the owned items for the item we are looking for
            for(var j=0; j < ownedItems.length;j++){
              if(ownedItems[j].name == allItems[i]){
                console.log(ownedItems[j]);
              }
            }
          }
    },

    getIndex: (item, list)=>{
      //gets the index of an item in a given array
      console.log(list[0])
      for(var i = 0; i < list.length; i++){
        if(list[i].name == item){
          return i;
        }
      }
      return null;
    },





}

export default storeHelper














































// const storeHelper = {

//   buyItem : async(name : string) => {
//     let item = await storeHelper.getItem(name);
//     // update items numBought field
//     item.numBought++;
//     item.numAvailable++;
//     await AsyncStorage.setItem(name, JSON.stringify(item));

//   },

//   getItem : async(name : string) => {
//     try {
//       let itemString = await AsyncStorage.getItem(name);
//       return JSON.parse(String(itemString));
//     } catch(error){
//       console.log(error);
//       return "error";
//     }
//   },

//   saveData : async (obj) => {
//     let date = storeHelper.getDate();
//     //checks if person already checked in today
//     let data = await checkInHelper.retrieveData(date);
//     if(data == "error" || data != null){
//       alert("You have already checked in today");
//     }
//     else{//adds new information to storage
//       try{
//         let checkInData = obj;
//         await AsyncStorage.setItem(date, JSON.stringify(checkInData));
//         checkInHelper.updateDates(date);
//       }
//       catch(error){
//         console.log(error)
//       }
//     }


//   },

//   retrieveData : async (date) => {
//     try{
//       let asyncValue = await AsyncStorage.getItem(date);
//       return asyncValue;
//     }
//     catch(error){
//       console.log(error);
//       return "error";
//     }
//   },

//   displayAllData : async () => {
//     AsyncStorage.getAllKeys().then((keyArray) => {
//       AsyncStorage.multiGet(keyArray).then((keyValArray) => {
//         let myStorage: any = {};
//         for (let keyVal of keyValArray) {
//           myStorage[keyVal[0]] = keyVal[1]
//         }

//         console.log('CURRENT STORAGE: ', myStorage);
//       })
//     });
//   },

//   clearAllData : async ()=>{
//     AsyncStorage.clear();
//   },

//   getDate : () =>{
//     //gets the current date
//     let date = new Date();
//     let year = date.getFullYear();
//     let month = ("0"+(date.getMonth()+1)).slice(-2);
//     let day = ("0"+ date.getDate()).slice(-2);
//     condensedDate =  year + "-" + month + "-" + day;
//     return condensedDate;
//   },

//   updateDates : async (date)=>{
//     //check if at least one date has already been recorded
//     let asyncValue = await AsyncStorage.getItem("checkins");
//     if(asyncValue == null){
//       let allDates = [date];
//       await AsyncStorage.setItem("checkins", JSON.stringify(allDates))
//     }
//     else{
//       //add onto the previous array
//       asyncValue = JSON.parse(asyncValue)
//       asyncValue.push(date)
//       await AsyncStorage.setItem("checkins", JSON.stringify(asyncValue));
//     }
//   }
// }

// export default storeHelper
