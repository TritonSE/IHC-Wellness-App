import { Alert, AsyncStorage } from 'react-native';

import CheckinBackend from './CheckinBackend.tsx';

const ProfileBackend = {

  // CHECKIN LOGIC
  saveData: async (obj: any) => {
    const date = CheckinBackend.getDate();
    // checks if person already checked in today
    const data = await CheckinBackend.retrieveData(date);
    if (data === 'error' || data != null) {
      Alert.alert('You have already checked in today');
    } else {// adds new information to storage
      try {
        let checkInData = obj;
        checkInData = {
          hoursOfSleep: obj.hoursOfSleep,
          mood: obj.mood,
        };
        await AsyncStorage.setItem(date, JSON.stringify(checkInData));
        CheckinBackend.updateDates(date);
      } catch (error) {
        console.log(error);
      }
    }

  },

  retrieveDataSet: async (numDays: number) => {
    const dateSet = await ProfileBackend.retrieveDates(numDays);
    AsyncStorage.multiGet(dateSet, (err, result) => {
      console.log(result);
    });

  },

  retrieveDates: async (numDays: number) => {
    const dates = await AsyncStorage.getAllKeys();
    const today = new Date(CheckinBackend.getCurrentDate());
    const secondsLimit = (numDays - 1) * 24 * 60 * 60;
    // loops through all dates the user checked in
    let i = dates.length - 2;
    while (i >= 0) {
      const dateToCheck = new Date(dates[i]);
      const elapsedSeconds = (today.getTime() - dateToCheck.getTime()) / 1000;
      // if the date is farther away then the number of days the user passed in
      if (elapsedSeconds > secondsLimit) {
        dates.splice(i, 1); // remove the date from array
      }
      i--;
    }
    dates.splice(dates.length - 1, 1); // removes "checkin" key
    return dates;
  },

};

export default ProfileBackend;
