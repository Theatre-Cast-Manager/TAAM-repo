import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyD8rvn2a52hkMX2SLZSI-oQf9nX6aRL47Y",
  authDomain: "flowing-precept-414022.firebaseapp.com",
  projectId: "flowing-precept-414022",
  storageBucket: "flowing-precept-414022.appspot.com",
  messagingSenderId: "20455228671",
  appId: "1:20455228671:web:3e8e57d6b1eee44aa838ca",
  measurementId: "G-SBDTMTEWSH",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
