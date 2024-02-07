import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
    IonButtons, IonMenu, IonMenuButton } from '@ionic/react';
import { GoogleLogin } from '@react-oauth/google';
import './Login.css';

const Login: React.FC = () => {

    const handleSuccess = (credentialResponse) => {
        console.log(credentialResponse);
    };

    const handleError = () => {
        console.log('Login Failed');
    };

    return (
        <>
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Login with Google</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen>
                <h1>Testing</h1>

            <div>
                <GoogleLogin
                    onSuccess={handleSuccess}
                    onError={handleError}

                />
            </div>

            </IonContent>
        </IonPage>
        </>
    );
 };

export default Login;