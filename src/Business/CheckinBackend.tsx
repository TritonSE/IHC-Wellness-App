import { AsyncStorage } from 'react-native';

import { DefaultQuestions, ICheckinQuestion } from '../../constants/Questions'
import { getCurrentDate, isUserCheckedIn } from './ProfileBackend';
// TODO this interface will be moved to constants/Questions once frontend has an editing PoC
// import { ICheckinQuestion } from '../View/Screens/CheckinPage';

/*
TODO
Ask Bobby about the frontend logic, it probably makes sense
to use an MVVM (frontend-driven) pattern for certain CRUD
operations on questionArray. This pattern would entail NOT
converting this to a singleton as the frontend would get its
initial state from here and make calls here to updates its state,
but no data would need to be stored here; instead only having it handle
saving a checkin, getting the current questions array from storage,
and operations on a questions array passed as a parameter such as
filtering the active questions and adding a new question

This file would thus require the least refactoring, mostly replacing getItem calls
with a parameter for the current value that getItem was getting as well as
replacing for loops with calls to higher-order functions
*/



const CheckinBackend = {

  // CHECKIN LOGIC
  saveData: async (checkin: object) => {
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

  displayAllData: async () => {
    // TODO nested then calls are undesirable, instead use promise chaining
    // by returning .multiGet() inside the first .then() and calling .then()
    // with the callback that already exists
    // https://javascript.info/promise-chaining has good info
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
    return allDates
  },

  // TODO use starter questions in constants/Questions.ts to populate default array
  // For CRUD operations like these, return the created/updated values and any promises
  // that the data will be saved
  createDefaultQuestionsArray: async ()=>{
    await AsyncStorage.setItem('questions', JSON.stringify([DefaultQuestions]));
  },

  // TODO this function will still be needed in the MVVM model, but add
  // the questions array parameter and return the updated array and the promise
  // it will be saved to storage
  addQuestion: async (questionArray: ICheckinQuestion[], question: string, key: string)=>{
    let updatedQuestionArray: ICheckinQuestion[];
    if(questionArray == null){
      updatedQuestionArray = [];
    } else {
      updatedQuestionArray = [...questionArray];
    }
    // creates an object of the question
    const questionObject: ICheckinQuestion = {
      question: question,
      used: false,
      key: key,
    }
    updatedQuestionArray.push(questionObject);
    //adds the question to asyncstorage
    const promise = AsyncStorage.setItem("questions", JSON.stringify(questionArray));
    return {
      newQuestionArray: updatedQuestionArray,
      promise: promise,
    }
  },

  storeAllQuestions: (questionArray: ICheckinQuestion[]) => {
    const promise = AsyncStorage.setItem('questions', JSON.stringify(questionArray));
    return promise;
  },

  // TODO this function might be unnecessary in the MVVM pattern where CheckinPage
  // handles setting questions to be active or not. Ask Bobby, but the needed
  // function will probably be storeAllQuestions that takes the questions array
  // from frontend and returns the promise that it will be saved to storage
  setQuestionActive: async (key: string, using: boolean)=>{
    //gets the question aray from asyncstorage
    const questionArrayJson = await AsyncStorage.getItem('questions');
    let questionArray = questionArrayJson ? JSON.parse(questionArrayJson) : null;
    if(questionArray == null){
      //ends function call if question array doesn't exist
      console.log("You do not have any saved questions");
      return
    }
    let questionObject = null
    //looks to see if the question already exist in array
    for(var i = 0; i< questionArray.length; i++){
      if(questionArray[i].key == key){
        //found the question, and set it to be used
        questionArray[i].used = using;
        questionObject = questionArray[i];
        console.log("this question's usage is now set to " + using);
        break;
      }
    }
    await AsyncStorage.setItem("questions", JSON.stringify(questionArray));
    return questionObject
  },

  getAllQuestions: async ()=>{
    const questionArrayJson = await AsyncStorage.getItem('questions');
    let questionArray = questionArrayJson ? JSON.parse(questionArrayJson) : null;
    // TODO refactor so that createDefault returns the array and the promise it will be saved
    if(questionArray == null){
      CheckinBackend.createDefaultQuestionsArray();
      return [];
    }
    console.log(questionArray);
    return questionArray;
  },

  // TODO add a questionsArray parameter and replace the for loops with a call to .filter()
  getUsedQuestions: async (questionArray: ICheckinQuestion[], used:boolean)=>{
    //gets the question aray from asyncstorage
    if(questionArray == null){
      //ends function call if question array doesn't exist
      console.log("There are no questions saved");
      return [];
    }

    // TODO this can be replaced with a .filter() call on questionArray
    //looks to find all the questions that are used (or not used)
    let matchingQuestion = questionArray.filter( (question) => {
      return question.used === used;
    });

    /*
    for(var i = 0; i< questionArray.length; i++){
      if(questionArray[i].used == used){
        //found the question that matches the sear criteria (used/not used)
        matchingQuestion.push(questionArray[i]);
      }
    }*/
    console.log(matchingQuestion);
    return matchingQuestion;

  },

};

export default CheckinBackend;
