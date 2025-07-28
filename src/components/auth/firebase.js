import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyC2pTtg-MmlivfU9tbh9BKklEJo35pEh1E",
    authDomain: "trackmate-71dc4.firebaseapp.com",
    projectId: "trackmate-71dc4",
    storageBucket: "trackmate-71dc4.firebasestorage.app",
    messagingSenderId: "566492862634",
    appId: "1:566492862634:web:f7a6703edce91310add8d3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
