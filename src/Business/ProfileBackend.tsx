import { AsyncStorage } from 'react-native';

import CheckinBackend from './CheckinBackend';

// Does not need to be a singleton as this logic is for queries, not state
const ProfileBackend = {

  retrieveCheckinSet: async (numDays: number) => {
    const dateSet = await ProfileBackend.retrieveDates(numDays);
    let dates = [];
    await AsyncStorage.multiGet(dateSet, (err, result) => {
      for(var i = 0; i < result.length; i++){
        let obj = {
          date : result[i][0],
          response : result[i][1],
        }
        dates.push(obj);
      }
    });
    console.log(dates);
    return dates;
  },

  retrieveCheckin: async (date: string) => {
    try {
      const asyncValue = await AsyncStorage.getItem(date);
      return asyncValue;
    } catch (error) {
      console.log(error);
      return 'error';
    }
  },

  // TODO the call to getAllKeys() needs to be removed
  // CheckinBackend says dates are stored at 'checkins', load that instead
  // Remember to save JSON string and parse object in different variables
  getAllDates: async ()=>{
    const regex = /^([0-9]{4}-[0-9]{2}-[0-9]{2})$/;
    let dates = await AsyncStorage.getAllKeys();
    let acceptedKeys = [];
    //loops through the keys to select all the dates
    for( var i = 0; i < dates.length; i++){
      let currentKey = dates[i];
      let match = regex.test(currentKey);
      if(match){
        acceptedKeys.push(currentKey);
      }
    }
    console.log(`all dates in storage ${acceptedKeys}`);
    return acceptedKeys;
  },

  // TODO this logic can be made more efficient and less verbose
  // Idea is: get all dates, get all dates within range of that
  // Shorter and faster implementations would be 1 of 2 options:
  // Option 1: Use .findIndex() to find first index in all dates that
  //           is within range, then use .slice() to extract subarray
  //           from this index to the end
  // Option 2: Use .filter() to return a new array with only the dates
  //           that are in range
  // Option 1 would probably be easier and faster
  retrieveDates: async (numDays: number) => {
    const dates = await ProfileBackend.getAllDates();
    const today = new Date(CheckinBackend.getCurrentDate());
    const secondsLimit = (numDays - 1) * 24 * 60 * 60;
    // loops through all dates the user checked in
    let i = dates.length-1;
    while (i >= 0) {
      const dateToCheck = new Date(dates[i]);
      const elapsedSeconds = (today.getTime() - dateToCheck.getTime()) / 1000;
      // if the date is farther away then the number of days the user passed in
      if (elapsedSeconds > secondsLimit) {
        dates.splice(i, 1); // remove the date from array
      }
      i--;
    }
    return dates;
  },

};

export default ProfileBackend;
