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
} from "@ionic/react";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { handleLogin, handleLogout } from "../authService"; //functions are imported from ../authService.ts
import "./Login.css"; //styling

//Login functional component
const Login: React.FC = () => {
  const [userPhotoUrl, setUserPhotoUrl] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, set the user's profile picture URL
        setUserPhotoUrl(user.photoURL);
      } else {
        // User is signed out, reset the profile picture URL
        setUserPhotoUrl(null);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

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

          <div>
            <IonButton onClick={handleLogin}>Sign in</IonButton>  {/* button for logging in, uses the handleLogin() function as an onClick event handler. When this button is clicked, it will attempt to log in the user using Google's OAuth through Firebase Auth. */}
            <IonButton onClick={handleLogout}>Sign out</IonButton> {/* button for logging out, with the handleLogout() function attached to its onClick event */}
            <IonButton routerLink="/">Go to Dashboard</IonButton> {/*can we make this button appear only after successful login?*/} 
          </div>
        </IonContent>
      </IonPage>
    </>
  );
};

export default Login;
//Login component is exported so that it can be imported and used in other parts of the app, like the routing setup in App.tsx.

