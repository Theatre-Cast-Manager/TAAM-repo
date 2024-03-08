/*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%                                        Login imports                                         %%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/
import React, { useState, useEffect } from 'react';
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
import { handleLogin, handleLogout } from "../authService"; //functions are imported from ../authService.ts
import "./Login.css"; //styling

/*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%                                        Login functionality                                   %%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/
const Login: React.FC = () => {
  const [userPhotoUrl, setUserPhotoUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, set the user's profile picture URL
        setUserPhotoUrl(user.photoURL);
        console.log("I made it!");
        console.log(user);
      } else {
        // User is signed out, reset the profile picture URL
        setUserPhotoUrl(null);
        console.log("I made it to the else!!!");
      }
    });
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  //Login function
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

  //Logout function
  const logout = () => {
    handleLogout()
      .catch((error) => {
        // Handle any errors that occur during logout
        console.error("Logout failed:", error);
        setErrorMessage("Failed to log out. Please try again.");
      });
  };

  return (
    <>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Welcome to TAAM</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <h1>Sign in to Taam with Google</h1>
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          <div>
            {!userPhotoUrl && ( <IonButton onClick={login}>Sign in</IonButton>)} { /* use the login function */ }
            {userPhotoUrl && ( <>
                <IonButton onClick={logout}>Sign out</IonButton>  {/* use the logout function */}
                <IonButton routerLink="/dashboard">Go to Dashboard</IonButton>
              </>)}
          </div>
          {userPhotoUrl && ( <IonImg src={userPhotoUrl} alt="User Profile" /> )}
        </IonContent>
      </IonPage>
    </>
  );
};

export default Login;
//Login component is exported so that it can be imported and used in other parts of the app, like the routing setup in App.tsx.

