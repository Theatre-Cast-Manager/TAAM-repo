/*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%                            Firebase Auth (FbA) Import Statements                             %%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/
import {    //these import statements bring in the necessary FbA functionalities from the Fb SDK.
  getAuth,   //FbA method, initializes the authentication service
  signInWithPopup,    // FbA method for signing in users via a popup window
  signOut,    // FbA method to sign users out
  GoogleAuthProvider,   //manage Google sign-in
} from "firebase/auth";
import { app } from "./firebaseConfig"; // imports the initialized Fb app instance from firebaseConfig.ts file, ensuring that FbA uses our project's specific configuration


/*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%            Initialization of Firebase Auth and GoogleAuthProvider Setup                      %%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/
const provider = new GoogleAuthProvider();  //creates a new instance of the GoogleAuthProvider, which is necessary for authenticating users with their Google accounts
const auth = getAuth(app);  //initializes the FbA service for your application using the Fb app instance


/*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%                              Authentication Functions:                                       %%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/
// function to authenticate users using a popup window for Google sign-in. 
const handleLogin = () => {
  return signInWithPopup(auth, provider);
};

// function to sign out the currently authenticated user
const handleLogout = () => {
  return signOut(auth);
};

export { handleLogin, handleLogout };
