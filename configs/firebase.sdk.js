import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/database";

const config = {
    apiKey: "AIzaSyCJ7DUvXdzcSsKS99ZAZCEc4DEoykH8c6Q",
    authDomain: "unfac-us-central.firebaseapp.com",
    databaseURL: "https://unfac-us-central.firebaseio.com",
    projectId: "unfac-us-central",
    storageBucket: "unfac-us-central.appspot.com",
    messagingSenderId: "220430569551"
  }


  !firebase.apps.length ? firebase.initializeApp(config) : ''
export const auth = firebase.auth()
export default firebase
