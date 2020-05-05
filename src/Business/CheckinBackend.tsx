import { Alert, AsyncStorage } from 'react-native';

const CheckinBackend = {

  // CHECKIN LOGIC
  // TODO define checkin type
  saveData: async (checkin: any) => {
    const date = CheckinBackend.getCurrentDate();
    // checks if person already checked in today
    const data = await CheckinBackend.retrieveData(date);
    if (data === 'error' || data != null) {
      Alert.alert('You have already checked in today');
    } else {
      // add new information to storage
      try {
        let checkInData = checkin;
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
    return CheckinBackend.parseDate();
  },

  parseDate: (dateInMilliseconds: number = new Date().getTime()) => {
    // gets the current date or the date from time in milliseconds
    const date = new Date(dateInMilliseconds);
    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);
    const condensedDate = `${year}-${month}-${day}`;
    return condensedDate;
  },

  updateDates: async (date: string) => {
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
  },

  getPlaceholder: (dateToCheck: string) => {
    console.log(dateToCheck);
    if (dateToCheck === '') {
      return 'select date';
    }
    return dateToCheck;
  },

  createQuestionsAsync: async ()=>{
    await AsyncStorage.setItem('questions', JSON.stringify([]));
  },

  addQuestion: async (question: string)=>{
    //gets the question aray from asyncstorage
    const questionArrayJson = await AsyncStorage.getItem('questions');
    let questionArray = questionArrayJson ? JSON.parse(questionArrayJson) : null;
    if(questionArray == null){
      questionArray = [];
    }
    //creates an object of the question
    const questionObject = {
      question: question,
      used: false,
    }
    questionArray.push(questionObject);
    //adds the question to asyncstorage
    await AsyncStorage.setItem("questions", JSON.stringify(questionArray));
  },

  setQuestionUsage: async (question: string, using: boolean)=>{
    //gets the question aray from asyncstorage
    const questionArrayJson = await AsyncStorage.getItem('questions');
    let questionArray = questionArrayJson ? JSON.parse(questionArrayJson) : null;
    if(questionArray == null){
      //ends function call if question array doesn't exist
      console.log("Question was not found");
      return
    }
    //looks to see if the question already exist in array
    for(var i = 0; i< questionArray.length; i++){
      if(questionArray[i].question == question){
        //found the question, and set it to be used
        questionArray[i].used = using;
        console.log("this question's usage is now set to " + using);
        break;
      }
    }
    await AsyncStorage.setItem("questions", JSON.stringify(questionArray));
  },


  getAllQuestions: async ()=>{
    const questionArrayJson = await AsyncStorage.getItem('questions');
    let questionArray = questionArrayJson ? JSON.parse(questionArrayJson) : null;
    if(questionArray == null){
      CheckinBackend.createQuestionsAsync();
      return [];
    }
    console.log(questionArray);
    return questionArray;
  },

  getUsedQuestions: async (used:boolean)=>{
    //gets the question aray from asyncstorage
    const questionArrayJson = await AsyncStorage.getItem('questions');
    let questionArray = questionArrayJson ? JSON.parse(questionArrayJson) : null;
    if(questionArray == null){
      //ends function call if question array doesn't exist
      console.log("There are no questions saved");
      return [];
    }

    //looks to find all the questions that are used (or not used)
    let matchingQuestion = [];
    for(var i = 0; i< questionArray.length; i++){
      if(questionArray[i].used == used){
        //found the question that matches the sear criteria (used/not used)
        matchingQuestion.push(questionArray[i]);
      }
    }
    console.log(matchingQuestion);
    return matchingQuestion;

  }


};

export default CheckinBackend;
