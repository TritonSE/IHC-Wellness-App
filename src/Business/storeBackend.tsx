import { AsyncStorage } from 'react-native';
import { string } from 'prop-types';

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

    splicePots : function() {
        return this.storeMatrix[0].slice(this.metadataCount)
    },
    spliceStems : function() {
        return this.storeMatrix[1].slice(this.metadataCount)
    },
    spliceFlowers : function() {
        return this.storeMatrix[2].slice(this.metadataCount)
    },

    

    buyItem: async function(item: string) {
        // if (AsyncStorage.getItem("Items") )
        // let count = 1
        // AsyncStorage.setItem(item, count.toString())

        let asyncValue = await AsyncStorage.getItem("Items");
        if(asyncValue == null){
            await AsyncStorage.setItem("Items", JSON.stringify([]))
        }
        else{
            //add onto the previous array
            asyncValue = JSON.parse(asyncValue)
            let count = 1
            
            asyncValue.push({item: count.toString()})
            await AsyncStorage.setItem("Items", JSON.stringify(asyncValue));
        }
    },

    getItems : async () => {
        AsyncStorage.getAllKeys().then((keyArray) => {
            AsyncStorage.multiGet(keyArray).then((keyValArray) => {
                let myStorage: any = {};
                for (let keyVal of keyValArray) {
                    myStorage[keyVal[0]] = keyVal[1]
                }
    
                console.log('CURRENT STORAGE: ', myStorage);
            })
        });
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
