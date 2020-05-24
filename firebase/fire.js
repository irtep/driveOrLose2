import firebase from 'firebase'
import { apiConfig } from '../config.js'; 
var config = { 
      apiKey: apiConfig.apiKey, // ok
      authDomain: apiConfig.authDomain, //ok
      databaseURL: apiConfig.databaseURL, //ok
      projectId: apiConfig.projectId,  // ok
      storageBucket: apiConfig.storageBucket,
      messagingSenderId: apiConfig.messagingSenderId
    };
firebase.initializeApp(config);
export default firebase;