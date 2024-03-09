import { initializeApp } from "firebase/app"; // imports the initializeApp function from the Firebase SDK's app module. The initializeApp function is used to initialize  your web app with Firebase's services using the specific configuration details you provide (like your project's API key, auth domain, project ID, etc.). When you call initializeApp with your Firebase configuration object, it sets up your  application to communicate with Firebase services, enabling you to use them (like Firestore, Auth, Analytics, and more) in your app.
import { getAnalytics } from "firebase/analytics";  //import the Firebase Analytics service into Taam
// see authService.ts for Firebase Auth import and setup

/*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%                                    Firebase Config object                                   %%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/
const firebaseConfig = {  // this firebaseConfig object includes various key-value pairs that uniquely identify your Fb project and grant your app access to Fb services
  apiKey: "AIzaSyD8rvn2a52hkMX2SLZSI-oQf9nX6aRL47Y",
  authDomain: "flowing-precept-414022.firebaseapp.com",
  projectId: "flowing-precept-414022",
  storageBucket: "flowing-precept-414022.appspot.com",
  messagingSenderId: "20455228671",
  appId: "1:20455228671:web:3e8e57d6b1eee44aa838ca",
  measurementId: "G-SBDTMTEWSH",
};

// initialize firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
