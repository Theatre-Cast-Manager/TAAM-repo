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
            <IonTitle>Menu Content</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">This is the menu content.</IonContent>
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