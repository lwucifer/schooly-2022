import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

// Your web app's Firebase configuration
// console.log("[process.env]", process.env);
var firebaseConfig = {
    // apiKey: "AIzaSyBjG_rG7dp2-IqxI_28nUfG5MlcpiNpjmo",
    // authDomain: "schoolly-37aa8.firebaseapp.com",
    // databaseURL: "https://schoolly-37aa8.firebaseio.com",
    // projectId: "schoolly-37aa8",
    // storageBucket: "schoolly-37aa8.appspot.com",
    // messagingSenderId: "590078046901",
    // appId: "1:590078046901:web:d30773daf7967d8d1b84fc",
    // measurementId: "G-LN58DKHESW"

    apiKey: process.env.FB_API_KEY,
    authDomain: process.env.FB_AUTH_DOMAIN,
    databaseURL: process.env.FB_DB_URL,
    projectId: process.env.FB_PROJECT_ID,
    storageBucket: process.env.FB_STORAGE_BUCKET,
    messagingSenderId: process.env.FB_MESSAGING_SENDER_ID,
    appId: process.env.FB_APP_ID,
    measurementId: process.env.FB_MEASUREMENT_ID
};

!firebase.apps.length ? firebase.initializeApp(firebaseConfig) : "";

// init fb cloud messaging
// const messaging = firebase.messaging();
// messaging.usePublicVapidKey('PUBLIC KEY');
// messaging.requestPermission()
//     .then(() => {
//         console.log("[Messaging] have permission");
//         return messaging.getToken();
//     })
//     .catch(token => {
//         console.log("[Messaging] token", token)
//     })
//     .catch(err => {
//         console.log("[Messaging] Error occured ", err);
//     })

export const GoogleProvider = new firebase.auth.GoogleAuthProvider();
export const authFire = firebase.auth();
export const DB = firebase.database();

export default firebase;