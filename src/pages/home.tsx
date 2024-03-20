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
  IonInput,
} from "@ionic/react";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { handleLogout } from "../authService";
import "./home.css";

/*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%                                        'Home' page                                           %%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/
const HomePage: React.FC = () => {
  /*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  %%                                        Login functionality                                   %%
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/
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

  /*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  %%                                  Data Gathering Functionality                                %%
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/
  //A reminder of what our input element looks like:
  // <IonInput label='sheet_url' value={givenUrl} ref={ionInputEl} onIonInput={handleInput}></IonInput>
  // the value attribute controls what is displayed in the input field - we will clear this after the submit URL button has been clicked to clear the field
  // the ref attribute allows us to connect our element to a reference we can use to manipulate the field and gather information from it
  
  //Controls our input element (this is what we assign 'ref' in the input element)
  const ionInputEl = useRef<HTMLIonInputElement>(null);

  //Holds the URL given to us by the user
  const [givenUrl, setGivenUrl] = useState("");

  //Updates the URL given to us when the value in the input element is changed
  const handleInput = (e: CustomEvent) => {
    setGivenUrl(e.detail.value as string);
  };

  //Holds the sheetID we will feed to our API call
  const [sheetID, setSheetID] = useState("");

  //Sets our sheetID variable when the user submits a URL
  const handleClick = ( e : Event ) => {
    //Access the given URL indirectly (indirect because it is set in the handleInput() function)
    const value = givenUrl;
    const startIndex = value.indexOf("/d/") + 3;
    const endIndex = value.indexOf("/edit");

    //Extract the sheet ID from the givenURL and update our sheetID variable
    if (startIndex >= 0) {
      setSheetID(value.substring(startIndex, endIndex));
    } 

    //Clear the input field
    setGivenUrl("");

    //TODO - error handling
  }

  //Holds the form field information and the fetched data
  const [data, setData] = useState<any>(null);
  const [formFields, setFormFields] = useState([]);


  //TODO - API call to fetch data
  //Something like...
  // useEffect( () => {
  //   const fetchData = async () => {
  //   if(sheetID){
  //     try{
  //       //Here is where the API call would go
  //       //If our call is successful we would set our 'data' variable and our 'formFields' value to be the first row from the 'data' array
  //     }
  //     catch(err){
  //       console.error("Error in fetching data: ", err);
  //     }
  //   }
  //  };
  //  fetchData();
  // }, [sheetID]) //sheetID is only updated after the submit button is clicked, so we can add it as a dependency.

  /*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  %%                                  Data Parsing Functionality                                  %%
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/

  //Holds information about our data that we need to properly display it
  const [urlColumn, setUrlColumn] = useState(-1);
  const [nullCols, setNullCols] = useState<number[]>([]);
  const [nameCol, setNameCol] = useState(-1);

  //Data parsing function
  useEffect( () => {
    const parseData = () => {
      if(data){
        formFields.forEach((columnData, columnIndex) => {
          //Look for the name column
          if(String(columnData).includes("name")){ //might need to include more than one check here for thourough-ness
            setNameCol(columnIndex);
          }
          //Check for any null columns we may need to skip over later
          if(!columnData){
            setNullCols(prevNullCols => [...prevNullCols, Number(columnIndex)]);
          }
          //Determine which column holds the image url
          let firstRow = data[1];
          firstRow.forEach((columnData, columnIndex) => {
            if(String(columnData).startsWith('http')){
              setUrlColumn(columnIndex);
            }
          })
        })
      }
      else{
        console.log("data is null");
      }
    }
    parseData();
  })

  /*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  %%                                  Image Display Functionality                                 %%
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/
  //TODO: update alt tag with actor's name
  //Example call: <img src={generateThumbnailUrl(extractIdFromUrl(columnData))} alt="Thumbnail" />
  const extractIdFromUrl = (url) => {
    const startIndex = url.indexOf("id=") + 3;
    if (startIndex >= 0) {
      return url.substring(startIndex);
    } else {
      console.error("Invalid URL format");
      return null; // We may want to update the handling here
    }
  };
  
  const generateThumbnailUrl = (id) => {
    //console.log(`https://drive.google.com/thumbnail?sz=w300&id=${id}`);
    const width = 300;
    return `https://drive.google.com/thumbnail?sz=w${width}&id=${id}`;
  };

  /*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  %%                                 Developer/User Functionality                                 %%
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/
  //These can be attatched to buttons to quickly expand or collapse all summary elements that hold form data
  const expandAll = () => {
    const summaries = document.querySelectorAll('summary');
    summaries.forEach((summary: HTMLSummaryElement) => {
      const details = summary.parentElement as HTMLDetailsElement;
      details.open = true;
    });
  };

  const collapseAll = () => {
    const summaries = document.querySelectorAll('summary');
    summaries.forEach((summary: HTMLSummaryElement) => {
      const details = summary.parentElement as HTMLDetailsElement;
      details.open = false;
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
          <div id='instructions'>
            <p>
              To view your application submissions, please paste the URL of the sheet associated with your audition form.
            </p>
          </div>
          <div id='url_submission'>
            <h1>URL:</h1>
            <IonInput label='sheet_url' value={givenUrl} ref={ionInputEl} onIonInput={handleInput}></IonInput>
            <IonButton onClick={handleClick}>Submit URL</IonButton>
          </div>
        </IonContent>
      </IonPage>
    </>
  );
};

export default HomePage;
