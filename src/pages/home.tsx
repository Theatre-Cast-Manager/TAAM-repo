/*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%                                       'Home' imports                                         %%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/
import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonButtons,
  IonMenu,
  IonMenuButton,
} from "@ionic/react";
import ExploreContainer from "../components/ExploreContainer";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { handleLogout } from "../authService";
import "./home.css";

/*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%                                        'Home' page                                           %%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/
const HomePage: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(null); // To store user's name
  const [userPhotoUrl, setUserPhotoUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const history = useHistory(); // For navigation
  const menuRef = useRef<HTMLIonMenuElement>(null); // Ref for the IonMenu

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserPhotoUrl(user.photoURL || null);
        setUserName(user.displayName || "User"); // Set the user's name
      } else {
        // If not logged in, possibly redirect or handle accordingly
        history.push('/login'); // Redirects to Login if not authenticated
      }
    });
  }, [history]);

  const logout = () => {
    handleLogout()
      .then(() => {
        if (menuRef.current) {
          menuRef.current.close(); // Close the menu
        }
        history.push('/login');
      })
      .catch((error) => {
        console.error("Logout failed:", error);
        setErrorMessage("Failed to log out. Please try again.");
      });
  };

  return (
    <>
      <IonMenu contentId="main-content" ref={menuRef}> {/* Attach the ref to IonMenu */}
        <IonHeader>
          <IonToolbar>
            <IonTitle>Your Account</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <div className="profile">
            <img src={userPhotoUrl || '../../public/test_logo.jpg'} alt="User Profile" />
            <h1>{userName}</h1> {/* Display the user's name */}
            <IonButton onClick={logout}>Logout</IonButton>
          </div>
        </IonContent>
      </IonMenu>

      <IonPage id="main-content">
        <IonButtons slot="start">
          <IonMenuButton></IonMenuButton>
        </IonButtons>

        <IonContent fullscreen>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">Holla</IonTitle>
            </IonToolbar>
          </IonHeader>
          <ExploreContainer name="Tab 1 page" />
        </IonContent>
      </IonPage>
    </>
  );
};

export default HomePage;
