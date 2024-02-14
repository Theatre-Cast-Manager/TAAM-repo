import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
    IonButtons, IonMenu, IonMenuButton } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab1.css';

const Tab1: React.FC = () => {
  return (
    <>

    <IonMenu contentId="main-content">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Account Manager</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          {/* The user's Google PFP needs to be used as the source here */}
          <div className='profile'>
            <img src="../../public/test_logo.jpg" alt="placeholder PFP" />
            <h1>ABC Community Theatre</h1>
            <ion-button>Logout</ion-button>
          </div>
        </IonContent>
      </IonMenu>

    <IonPage id="main-content">
      <IonHeader>
        <IonToolbar>
            <IonButtons slot="start">
                <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle>Form Manager</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 1</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="Tab 1 page" />
      </IonContent>
    </IonPage>
    </>
  );
};

export default Tab1;