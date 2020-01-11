import {AsyncStorage } from 'react-native';
import checkInHelper from './checkInBackend.tsx'

const profileHelper = {
  //CHECKIN LOGIC
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
        checkInData = {
          mood: obj.mood,
          hoursOfSleep: obj.hoursOfSleep
        }
        await AsyncStorage.setItem(date, JSON.stringify(checkInData));
        checkInHelper.updateDates(date);
      }
      catch(error){
        console.log(error)
      }
    }


  },


  retrieveDataSet : async (days) =>{
    let dateSet = await profileHelper.retrieveDates(days)
    AsyncStorage.multiGet(dateSet, (err,result)=>{
      console.log(result)
    })

  },

  retrieveDates : async (days) =>{
    let dates = await AsyncStorage.getAllKeys();
    let today = new Date(checkInHelper.getCurrentDate());
    let secondsLimit = (days-1) * 24 * 60 * 60
    //loops through all dates the user checked in
    var i = dates.length-2;
    while(i>=0){
      let dateToCheck = new Date(dates[i]);
      let elapsedSeconds = (today.getTime() - dateToCheck.getTime())/1000;
      //if the date is farther away then the number of days the user passed in
      if(elapsedSeconds > secondsLimit){
        dates.splice(i,1)//remove the date from array
      }
      i--;
    }
    dates.splice(dates.length-1,1)//removes "checkin" key
    return dates
  }




}

export default profileHelper
