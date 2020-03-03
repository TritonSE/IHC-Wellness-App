import { AsyncStorage, ProgressViewIOSComponent } from 'react-native';
import { string } from 'prop-types';
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
    },

    buyItem: async function(item: string, section) {

        let ownedValue = await AsyncStorage.getItem("owned");

        //create owned arrray if doesn't exist already
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
          }
        }

        //item was not found, so create a new instance
        if(!found){
          alert("You are trying to buy an item that doesn't exist");
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

    /*getIndex: (item, list)=>{
      //gets the index of an item in a given array
      console.log(list[0])
      for(var i = 0; i < list.length; i++){
        if(list[i].name == item){
          return i;
        }
      }
      return null;
    },*/

    /*getItems : async () => {
          var allItems = storeHelper.getAllItems();
          var ownedItems;
          try{//gets the list of all the items the user has
            ownedItems = await AsyncStorage.getItem("owned");
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
    },*/



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
