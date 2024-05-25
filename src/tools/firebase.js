// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDsHfXEQKCShDCHu4ol_l4QJ4YO0V66y1I",
  authDomain: "aiproj-moviesuggest.firebaseapp.com",
  databaseURL:
    "https://aiproj-moviesuggest-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "aiproj-moviesuggest",
  storageBucket: "aiproj-moviesuggest.appspot.com",
  messagingSenderId: "433755918695",
  appId: "1:433755918695:web:bd6e773b261294e1ed5fc2",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const database = getDatabase(app);
