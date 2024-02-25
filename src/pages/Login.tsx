import React from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
} from "@ionic/react";
import { handleLogin, handleLogout } from "../authService";
import "./Login.css";

const Login: React.FC = () => {
  return (
    <>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Welcome to TAAM</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent fullscreen>
          <h1>Login with your Google account below</h1>

          <div>
            <IonButton onClick={handleLogin}>Login</IonButton>
            <IonButton onClick={handleLogout}>Logout</IonButton>
            <IonButton routerLink="/">Go to Dashboard</IonButton>
          </div>
        </IonContent>
      </IonPage>
    </>
  );
};

export default Login;
