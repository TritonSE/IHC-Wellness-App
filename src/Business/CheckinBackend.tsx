import { Alert, AsyncStorage } from 'react-native';

const CheckinBackend = {

  // CHECKIN LOGIC
  // TODO define checkin type
  saveData: async (obj: any) => {
    const date = CheckinBackend.getCurrentDate();
    // checks if person already checked in today
    const data = await CheckinBackend.retrieveData(date);
    if (data === 'error' || data != null) {
      Alert.alert('You have already checked in today');
    } else {
      // add new information to storage
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

  retrieveData: async (date: string) => {
    try {
      const asyncValue = await AsyncStorage.getItem(date);
      return asyncValue;
    } catch (error) {
      console.log(error);
      return 'error';
    }
  },

  parseData: (dataString: string) => {
    if (dataString == null) {
      return 'You did not check in that day';
    }
    const parsed = JSON.parse(dataString);
    let text = '';
    Object.keys(parsed).forEach((key) => {
      text += `${key} : ${parsed[key]}\n`;
    });
    return text;
  },

  displayAllData: async () => {
    AsyncStorage.getAllKeys().then((keyArray) => {
      AsyncStorage.multiGet(keyArray).then((keyValArray) => {
        const myStorage: any = {};
        for (const keyVal of keyValArray) {
          myStorage[keyVal[0]] = keyVal[1];
        }

        console.log('CURRENT STORAGE: ', myStorage);
      });
    });
  },

  clearAllData: async () => {
    await AsyncStorage.clear();
  },

  getCurrentDate: () => {
    // gets the current date
    return CheckinBackend.parseDate(new Date().getTime());
  },

  parseDate: (dateInMilliseconds: number) => {
    const date = new Date(dateInMilliseconds);
    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);
    const condensedDate =  `${year}-${month}-${day}`;
    return condensedDate;
  },

  updateDates: async (date: string) => {
    // check if at least one date has already been recorded
    const asyncValueJson = await AsyncStorage.getItem('checkins');
    if (asyncValueJson == null) {
      const allDates = [date];
      await AsyncStorage.setItem('checkins', JSON.stringify(allDates));
    } else {
      // add onto the previous array
      const asyncValue = JSON.parse(asyncValueJson);
      asyncValue.push(date);
      await AsyncStorage.setItem('checkins', JSON.stringify(asyncValue));
    }
  },

  // RETRIEVING CHECKIN DATA
  /*
  getCheckin : () => {

  },
  */

  getPlaceholder: (dateToCheck: string) => {
    console.log(dateToCheck);
    if (dateToCheck === '') {
      return 'select date';
    }
    return dateToCheck;
  },

};

export default CheckinBackend;
