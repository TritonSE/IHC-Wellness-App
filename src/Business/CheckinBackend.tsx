import { AsyncStorage } from 'react-native';

import { DefaultQuestions, ICheckinQuestion } from '../../constants/Questions';
import { getCurrentDate, isUserCheckedIn } from './ProfileBackend';
// TODO this interface will be moved to constants/Questions once frontend has an editing PoC
// import { ICheckinQuestion } from '../View/Screens/CheckinPage';

const CheckinBackend = Object.freeze({

  /**
   * Saves a checkin object to async storage
   * @param: the object with the checkin data
   * @returns : none
   */
  saveCheckin: async (checkin: object) => {
    const date = getCurrentDate();
    // checks if person already checked in today
    const userCheckedIn = await isUserCheckedIn();
    if (userCheckedIn) return null;

    // add new information to storage
    try {
      // Spread syntax to make copy of checkin
      const checkInData = { ...checkin };
      await AsyncStorage.setItem(date, JSON.stringify(checkInData));
      CheckinBackend.addNewDate(date);
      return checkInData;
    } catch (error) {
      console.log(error);
    }

  },

  /**
   * Gets all the questions in async storage
   * @param: none
   * @returns : all the questions in async storage
   */
  getQuestions: async () => {
    const questionArrayJson = await AsyncStorage.getItem('questions');
    const questionArray = questionArrayJson ? JSON.parse(questionArrayJson) : null;
    // TODO refactor so that createDefault returns the array and the promise it will be saved
    if (questionArray == null) {
      const asyncPromise = CheckinBackend.createDefaultQuestionsArray();
      return {
        questions: [],
        promise: asyncPromise,
      };
    }
    console.log(questionArray);
    return questionArray;
  },

  /**
   * Takes in a question array and stores all of it into async storage
   * @param: The question array that you want to add to async
   * @returns : a promise for setting the questions to async
   */
  setQuestions: (questionArray: ICheckinQuestion[]) => {
    return AsyncStorage.setItem('questions', JSON.stringify(questionArray));
  },

  /**
   * helper method to add a date to async storage
   * @param: the current date in the format YYYY-MM-DD
   * @returns : none
   */
  addNewDate: async (date: string) => {
    // check if at least one date has already been recorded
    const checkinsJson = await AsyncStorage.getItem('checkins');
    let allDates = checkinsJson ? JSON.parse(checkinsJson) : null;
    // create an array with the first date or append to the existing array
    if (allDates == null) {
      allDates = [date];
    } else {
      allDates.push(date);
    }
    await AsyncStorage.setItem('checkins', JSON.stringify(allDates));
    return allDates;
  },

  /**
   * Creates the default question array in async
   * @param: none
   * @returns : a promise that the default has been added
   */
  createDefaultQuestionsArray: () => {
    return AsyncStorage.setItem('questions', JSON.stringify(DefaultQuestions));
  },

  /**
   * adds a question to async storage
   * @param: questionArray - the current state of the question array
   * @param: question - the new question ti add
   * @param: key - the key for the new question
   * @returns : an object containing the updated question array along with the promise
   */
  addQuestion: async (questionArray: ICheckinQuestion[], question: string, keyParam: string) => {
    let updatedQuestionArray: ICheckinQuestion[];
    if (questionArray == null) {
      updatedQuestionArray = [];
    } else {
      updatedQuestionArray = [...questionArray];
    }
    // creates an object of the question
    const questionObject: ICheckinQuestion = {
      title: question,
      active: false,
      key: keyParam,
      type: 'slider',
    };
    updatedQuestionArray.push(questionObject);
    // adds the question to asyncstorage
    const asyncPromise = AsyncStorage.setItem('questions', JSON.stringify(questionArray));
    return {
      newQuestionArray: updatedQuestionArray,
      promise: asyncPromise,
    };
  },

  /**
   * Sets a specific question's activity
   * @param: key - the key for the question you want to cahnge
   * @param: using - whether you want to set the usage to true or false
   * @returns : the new question object
   */
  setQuestionActive: async (key: string, using: boolean) => {
    // gets the question aray from asyncstorage
    const questionArrayJson = await AsyncStorage.getItem('questions');
    const questionArray = questionArrayJson ? JSON.parse(questionArrayJson) : null;
    if (questionArray == null) {
      // ends function call if question array doesn't exist
      console.log('You do not have any saved questions');
      return;
    }
    let questionObject = null;
    // looks to see if the question already exist in array
    for (const question of questionArray) {
      if (question.key === key) {
        // found the question, and set it to be used
        question.used = using;
        questionObject = question;
        console.log('this question\'s usage is now set to ${using}');
        break;
      }
    }

    await AsyncStorage.setItem('questions', JSON.stringify(questionArray));
    return questionObject;
  },

  /**
   * Gets all the questions with a specific usage activity (true or false)
   * @param: questionarray - the array of questinos you want to filter through
   * @param: used - which usage activities do you want to look for
   * @returns : an array of questions with the specific usage
   */
  getQuestionsByActive: async (questionArray: ICheckinQuestion[], active: boolean = true) => {
    // gets the question aray from asyncstorage
    if (questionArray == null) {
      // ends function call if question array doesn't exist
      console.log('There are no questions saved');
      return [];
    }

    // looks to find all the questions that are used (or not used)
    const matchingQuestions = questionArray.filter((question) => question.active === active);

    console.log(matchingQuestions);
    return matchingQuestions;

  },

  /**
   * Displays all data in async storage
   * @param: none
   * @returns : true if we were able to get everything from async and log it
   */
  displayAllData: async () => {
    AsyncStorage.getAllKeys((err, keys) => {
      AsyncStorage.multiGet(keys, (error, stores) => {
        stores.map((result, i, store) => {
          console.log({ [store[i][0]]: store[i][1] });
          return true;
        });
      });
    });
  },

  /**
   * Clears everything in async storage
   * @param: none
   * @returns : none
   */
  clearAllData: async () => {
    await AsyncStorage.clear();
  },

});

export default CheckinBackend;
