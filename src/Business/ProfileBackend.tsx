import { AsyncStorage } from 'react-native';
import CheckinBackend from './CheckinBackend';

const ProfileBackend = {
  retrieveDataSet: async (days: number) => {
    let dateSet = await ProfileBackend.retrieveDates(days);
    AsyncStorage.multiGet(dateSet, (err, result) => {
      console.log(result);
    });
  },

  // TODO needs to be updated to not use all keys
  retrieveDates: async (numDays: number) => {
    const dates = await AsyncStorage.getAllKeys();
    const today = new Date(CheckinBackend.getCurrentDate());
    const secondsLimit = (numDays - 1) * 24 * 60 * 60
    // loops through all dates the user checked in
    for (let i = dates.length - 2; i >= 0; --i) {
      const dateToCheck = new Date(dates[i]);
      const elapsedSeconds = (today.getTime() - dateToCheck.getTime()) / 1000;
      // if the date is farther away then the number of days the user passed in
      if (elapsedSeconds > secondsLimit) {
        dates.splice(i, 1); // remove the date from array
      }
    }
    dates.splice(dates.length - 1, 1); // removes "checkin" key
    return dates;
  },
};

export default ProfileBackend;
