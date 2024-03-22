/*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%                                        Login imports                                         %%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom'; // Import useHistory for navigation
import {  //UI components from the @ionic/react package
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonImg,
} from "@ionic/react";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { handleLogin } from "../authService"; //functions are imported from ../authService.ts
import "./Login.css"; //styling

/*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%                                        Login functionality                                   %%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/
const Login: React.FC = () => {
  const [userPhotoUrl, setUserPhotoUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const history = useHistory(); // Hook for programmatically navigating

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserPhotoUrl(user.photoURL); // User is signed in, set the user's profile picture URL
        console.log("I made it!");
        console.log(user);
        history.push('/home'); // Redirect to Home Screen upon successful login
      } else {
        setUserPhotoUrl(null);  // User is signed out, reset the profile picture URL
        console.log("I made it to the else!!!");
      }
    });
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [history]);  //add history to the dependency array

  //Login function with error checking
   const login = () => {
    handleLogin()
      .then((result) => {
        // Possibly handle successful login if needed.
      })
      .catch((error) => {
        // Handle any errors that occur during login
        console.error("Login failed:", error);
        setErrorMessage("Failed to log in. Please try again.");
      });
  };

  /*
  //Logout function with error checking
  const logout = () => {
    handleLogout()
      .catch((error) => {
        // Handle any errors that occur during logout
        console.error("Logout failed:", error);
        setErrorMessage("Failed to log out. Please try again.");
      });
  };
  */

  return (
    <>
      <IonPage>
        <IonHeader>
          <IonToolbar>
          <IonImg src="TAAM.png" style={{ width: '200px', height: '200px', margin: 'auto'}} />
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <h1>Sign in with your Google Account</h1>
          <div>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            {!userPhotoUrl && <IonButton onClick={login}>Sign in</IonButton>}
          </div>
        </IonContent>
      </IonPage>
    </>
  );
};

export default Login;
//Login component is exported so that it can be imported and used in other parts of the app, like the routing setup in App.tsx.

