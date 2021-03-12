import firebase from 'firebase/app';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBrztNJBwpza34M89hUiVhxDZxMdCGH0kQ",
  authDomain: "catwalk-a4888.firebaseapp.com",
  projectId: "catwalk-a4888",
  storageBucket: "catwalk-a4888.appspot.com",
  messagingSenderId: "513023449849",
  appId: "1:513023449849:web:b814ef58a043024f642028"
};

firebase.initializeApp(firebaseConfig);
export default firebase;
