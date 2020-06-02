import { AsyncStorage } from 'react-native';

export const retrievePreviousCheckins = async (numDays: number) => {
  const dateSet = await retrieveDates(numDays);

  let dates = null;
  await AsyncStorage.multiGet(dateSet, (err, result) => {
    if (err || !result) return null;
    dates = result.map((checkin) => {
      const [date, response] = checkin;
      return { date, response };
    });
  });

  console.log(dates);
  return dates;
};

export const isUserCheckedIn = async (): Promise<boolean> => {
  const data = await getCheckinByDate(getCurrentDate());
  return data === 'error' || data != null;
};

export const getCurrentDate = () => {
  return parseDate();
};

const getCheckinByDate = async (date: string) => {
  try {
    const asyncValue = await AsyncStorage.getItem(date);
    return asyncValue;
  } catch (error) {
    console.log(error);
    return 'error';
  }
};

const parseDate = (dateInMilliseconds: number = new Date().getTime()) => {
  // gets the current date or the date from time in milliseconds
  const date = new Date(dateInMilliseconds);
  const year = date.getFullYear();
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const day = `0${date.getDate()}`.slice(-2);
  const condensedDate = `${year}-${month}-${day}`;
  return condensedDate;
};

const getAllDates = async () => {
  const stringifiedDates = await AsyncStorage.getItem('checkins') || '[]';
  const dates = JSON.parse(stringifiedDates);
  return dates;
};

const retrieveDates = async (numDays: number) => {
  const allDates: string[] = await getAllDates();
  const today = new Date(getCurrentDate());
  const secondsLimit = (numDays - 1) * 24 * 60 * 60;

  const firstValidIndex = allDates.findIndex((date) => {
    const dateToCheck = new Date(date);
    const elapsedSeconds = (today.getTime() - dateToCheck.getTime()) / 1000;
    return elapsedSeconds <= secondsLimit;
  });
  return allDates.slice(firstValidIndex);
};
