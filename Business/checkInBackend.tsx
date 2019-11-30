import {AsyncStorage } from 'react-native';

const checkInHelper = {
  saveData : async (obj)=>{
    let date = checkInHelper.getDate();
    //checks if person already checked in today
    let data = await checkInHelper.retrieveData(date);
    if(data == "error" || data != null){
      alert("You have already checked in today");
    }
    else{//adds new information to storage
      try{
        let checkInData = obj;
        await AsyncStorage.setItem(date, JSON.stringify(checkInData));
        checkInHelper.updateDates(date);
      }
      catch(error){
        console.log(error)
      }
    }


  },

  retrieveData : async (date) => {
    try{
      let asyncValue = await AsyncStorage.getItem(date);
      return asyncValue;
    }
    catch(error){
      console.log(error);
      return "error";
    }
  },

  displayAllData : async () => {
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

  clearAllData : async ()=>{
    AsyncStorage.clear();
  },

  getDate : () =>{
    //gets the current date
    let date = new Date();
    let year = date.getFullYear();
    let month = ("0"+(date.getMonth()+1)).slice(-2);
    let day = ("0"+ date.getDate()).slice(-2);
    condensedDate =  year + "-" + month + "-" + day;
    return condensedDate;
  },

  updateDates : async (date)=>{
    //check if at least one date has already been recorded
    let asyncValue = await AsyncStorage.getItem("checkins");
    if(asyncValue == null){
      let allDates = [date];
      await AsyncStorage.setItem("checkins", JSON.stringify(allDates))
    }
    else{
      //add onto the previous array
      asyncValue = JSON.parse(asyncValue)
      asyncValue.push(date)
      await AsyncStorage.setItem("checkins", JSON.stringify(asyncValue));
    }
  }

}

export default checkInHelper
