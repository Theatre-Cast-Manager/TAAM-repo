import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonImg,
  IonButton,
  IonList,
  IonItem,
} from "@ionic/react";
import React from "react";
import "./Tab2.css";

const Tab2: React.FC = () => {
  const [userData, setUserData] = React.useState(null);
  React.useEffect(() => {
    getUserData().then((data) => setUserData(data));
  }, []);

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonImg src={userData.logoUrl} alt="Logo" />
          <IonTitle>Audition Forms</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Audition Forms</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonButton expand="full">Add Form</IonButton>
        <IonList>
          {userData.forms.map((form) => (
            <IonItem key={form.id}>
              {form.name}
              <IonButton fill="outline">Edit</IonButton>
              <IonButton fill="outline" color="danger">
                Delete
              </IonButton>
              <IonButton fill="outline">Generate QR Code</IonButton>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
