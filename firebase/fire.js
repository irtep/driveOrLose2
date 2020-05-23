import firebase from 'firebase'
var config = { /* COPY THE ACTUAL CONFIG FROM FIREBASE CONSOLE */
      apiKey: "AIzaSyDCIawWWRooKblm1qvjFdaHb8bMCj-Kfzk", // ok
      authDomain: "mycv-8b9e8.firebaseapp.com", //ok
      databaseURL: "https://mycv-8b9e8.firebaseio.com", //ok
      projectId: "mycv-8b9e8",  // ok
      storageBucket: "mycv-8b9e8.appspot.com",
      messagingSenderId: "carGame"
    };
firebase.initializeApp(config);
export default firebase;