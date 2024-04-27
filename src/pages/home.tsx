/*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%                                       'Home' imports                                         %%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/
import React, { useState, useEffect, useRef, MouseEventHandler } from "react";
import { useHistory } from "react-router-dom";
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
  IonFooter,
} from "@ionic/react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { handleLogout } from "../authService";
import "./home.css";
//pdf exporting impoorts
import { PDFDownloadLink, Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

declare global {
  interface HTMLSummaryElement extends HTMLElement {}
}

const googleSheetsApiKey = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY;

/*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%                                        'Home' page Typescript                                %%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/
const HomePage: React.FC = () => {
  /*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  %%                                        Side Menu()                                           %%
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/
  const [userName, setUserName] = useState<string | null>(null); // To store user's name
  const [userPhotoUrl, setUserPhotoUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
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
        history.push("/login"); // Redirects to Login if not authenticated
      }
    });
  }, [history]);

  const logout = () => {
    handleLogout()
      .then(() => {
        if (menuRef.current) {
          menuRef.current.close(); // Close the menu
        }

        history.push("/login");
        console.log("Logout successful");
      })
      .catch((error) => {
        console.error("Logout failed:", error);
        setErrorMessage("Failed to log out. Please try again.");
      });
  };

  /*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  %%                                     Get Data from URL()                                      %%
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
   A reminder of what our input element looks like:
   <IonInput label='sheet_url' value={givenUrl} ref={ionInputEl} onIonInput={handleInput}></IonInput>
   the value attribute controls what is displayed in the input field - we will clear this after the submit URL button has been clicked to clear the field
   the ref attribute allows us to connect our element to a reference we can use to manipulate the field and gather information from it
  */
  //Controls our input element (this is what we assign 'ref' in the input element)
  const ionInputEl = useRef<HTMLIonInputElement>(null);

  //Holds the URL given to us by the user
  const [givenUrl, setGivenUrl] = useState<string>("");

  //Updates the URL given to us when the value in the input element is changed
  const handleInput = (e: CustomEvent) => {
    setGivenUrl(e.detail.value as string);
  };

  //Holds the sheetID we will feed to our API call
  const [sheetID, setSheetID] = useState<string>("");

  //Sets our sheetID variable when the user submits a URL
  const handleClick: MouseEventHandler<HTMLIonButtonElement> = (event) => {
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
  };

  //Holds the form field information and the fetched data
  const [data, setData] = useState<string[][] | null>(null);
  const [formFields, setFormFields] = useState<string[]>([]);
  

  useEffect(() => {
    const fetchData = async () => {
      if (sheetID) {
        //url for fetching data = urlStart + sheetId + urlEnd = https://sheets.googleapis.com/v4/spreadsheets/[GIVENID]/values/Form Responses 1!A1:L27?key=API_KEY
        const urlStart = "https://sheets.googleapis.com/v4/spreadsheets/";
        const urlEnd = `/values/Form Responses 1!A1:AA100?key=${googleSheetsApiKey}`; //insert API key here
        const urlComplete = urlStart + sheetID + urlEnd;

        try {
          const response = await fetch(urlComplete);
          if (!response.ok) {
            throw new Error("Failed to fetch data");
          }
          const jsonData = await response.json();
          setData(jsonData.values);
          setFormFields(jsonData.values[0]);

          const bundleViewer = document.getElementById("form_data");
          if (bundleViewer) {
            console.log("display");
            bundleViewer.style.display = "block";
          } else {
            console.log("hide");
          }
        } catch (err) {
          console.error("Error fetching data: ", err);
        }
      }
    };

    const testDisplay = document.getElementById("test_display");
    const testDisplay2 = document.getElementById("test_display2");
    if (testDisplay) {
      testDisplay.style.display = "none";
    }
    if (testDisplay2) {
      testDisplay2.style.display = "none";
    }

    fetchData();
  }, [sheetID]);

  /*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  %%                                           Parse Data()                                       %%
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/
  //Holds information about our data that we need to properly display it
  const [urlColumn, setUrlColumn] = useState<number>(-1);
  const [nullCols, setNullCols] = useState<number[]>([]);
  const [nameCol, setNameCol] = useState<number>(-1);

  //Data parsing function
  useEffect(() => {
    const parseData = () => {
      if (data) {
        formFields.forEach((columnData, columnIndex) => {
          //Look for the name column
          if (String(columnData).includes("name")) {
            //might need to include more than one check here for thourough-ness
            setNameCol(columnIndex);
          }
          //Check for any null columns we may need to skip over later

          if (!columnData) {
            setNullCols((prevNullCols) => [
              ...prevNullCols,
              Number(columnIndex),
            ]);
          }
          //Determine which column holds the image url
          let firstRow = data[1];
          firstRow.forEach((columnData, columnIndex) => {
            if (String(columnData).startsWith("http")) {
              setUrlColumn(columnIndex);
            }

          });
        });
      } else {
        console.log("data is null");
      }
    };
    parseData();
  });

  /*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  %%                                          Display Data()                                      %%
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/
  //TODO: update alt tag with actor's name
  //Example call: <img src={generateThumbnailUrl(extractIdFromUrl(columnData))} alt="Thumbnail" />
  const extractIdFromUrl = (url: string) => {
    const startIndex = url.indexOf("id=") + 3;
    if (startIndex >= 0) {
      return url.substring(startIndex);
    } else {
      console.error("Invalid URL format");
      return ""; // We may want to update the handling here
    }
  };

  const generateThumbnailUrl = (id: string) => {
    //console.log(`https://drive.google.com/thumbnail?sz=w300&id=${id}`);
    const width = 300;
    return `https://drive.google.com/thumbnail?sz=w${width}&id=${id}`;
  };

  /*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  %%                                    Expand/Collapse Elements()                                %%
  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/
  //These can be attatched to buttons to quickly expand or collapse all summary elements that hold form data
  const expandAll = () => {
    const summaries = document.querySelectorAll("summary");
    summaries.forEach((summary: HTMLSummaryElement) => {
      const details = summary.parentElement as HTMLDetailsElement;
      details.open = true;
    });
  };

  const collapseAll = () => {
    const summaries = document.querySelectorAll("summary");
    summaries.forEach((summary: HTMLSummaryElement) => {
      const details = summary.parentElement as HTMLDetailsElement;
      details.open = false;
    });
  };


/*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%                                        'home' page HTML                                      %%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/

const styles = StyleSheet.create({
  page: { flexDirection: 'column', padding: 10 },
  section: { margin: 5, padding: 5 },
  text: { margin: 12, fontSize: 14 },
});

interface SingleAuditionPDFProps {
  row: string[];
}

interface AllAuditionPDFProps {
  data: string[][];
}

const SingleAuditionPDF: React.FC<SingleAuditionPDFProps> = ({ row }) => {
  return (
    <Document>
      <Page style={styles.page}>
        {row.map((dataPoint, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.text}>{dataPoint}</Text>
          </View>
        ))}
      </Page>
    </Document>
  );
};
  
  const AllAuditionsPDF: React.FC<AllAuditionPDFProps> = ({ data }) => (
    <Document>
      {data.map((row, rowIndex) => (
        <Page key={rowIndex} style={styles.page}>
          {row.map((value, index) => (
            <View key={index} style={styles.section}>
              <Text style={styles.text}>{value}</Text>
            </View>
          ))}
        </Page>
      ))}
    </Document>
  );
  
    return (
      // <Document>
      //   {data.slice(1).map((row, rowIndex) => (
      //     <Page key={rowIndex} style={styles.page}>
      //       {row.map((value, index) => (
      //         <View key={index} style={styles.section}>
      //           <Text>{`${data[0][index]}: ${value}`}</Text>
      //         </View>
      //       ))}
      //     </Page>
      //   ))}
      // </Document>

      <>
    <IonMenu contentId="main-content" ref={menuRef}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Your Account</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="profile">
          <img src={userPhotoUrl || '../../public/test_logo.jpg'} alt="User Profile" />
          <h1>{userName}</h1>
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
            To load audition data, paste the URL of the Sheet associated with your audition Form, and click 'View Auditions'
          </p>
        </div>
        <div id='url_submission'>
          <IonInput label='URL:' 
            value={givenUrl} 
            ref={ionInputEl} 
            onIonInput={handleInput}
            ></IonInput>
          <IonButton onClick={handleClick}>View Auditions</IonButton>
        </div>
        
        <div id='form_data_summary'>
        <h2>Auditions:</h2>
        <p> Select a name to view a single audition</p>
        <IonButton onClick={expandAll}>Expand All</IonButton>
        <IonButton onClick={collapseAll}>Collapse All</IonButton>
        {data && (
          <ul>
            {data.map((row, rowIndex) => (
              rowIndex > 0 && (
                <li key={rowIndex}>
                <details>
                  <summary>{row[nameCol]}</summary>
                  {Object.entries(row).map(([columnIndex, columnData], index) => (
                    !nullCols.includes(parseInt(columnIndex)) && (
                      <div key={index}>
                        {parseInt(columnIndex) === urlColumn ? (
                          <img src={generateThumbnailUrl(extractIdFromUrl(columnData))} alt="Thumbnail" />
                        ) : (
                          <p>{`${formFields[parseInt(columnIndex)]}: ${columnData}`}</p>
                        )}
                      </div>
                    )
                  ))}
                  <PDFDownloadLink
                    document={<SingleAuditionPDF row={row} />}
                    fileName={`${row[nameCol]}-audition.pdf`}
                  >
                    {({ loading }) => (loading ? 'Loading document...' : 'Export This Audition')}
                  </PDFDownloadLink>
                </details>
              </li>
              )         
            ))
            }
          </ul>
        )}
      </div>
      </IonContent>
      <IonFooter>
        <IonToolbar>
          <div>
            <p> Select 'Export All' to export all auditions as a single .pdf file</p>
            <div>
              {data && (
                <PDFDownloadLink
                  document={<AllAuditionsPDF data={data.slice(1)}/>}
                  fileName="all-auditions.pdf"
                >
                  {({ loading }) => (loading ? 'Loading document...' : 'Export All')}
                </PDFDownloadLink>
              )}
            
            {/* <PDFDownloadLink
            document={<AllAuditionsPDF data={data} />}
            fileName="all-auditions.pdf"
            >
            {({ loading }) => (loading ? 'Loading document...' : 'Export All Auditions')}
            </PDFDownloadLink> */}
            </div>
          </div>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  </>
    );
};

/*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%                     'home' page HTML from dev branch as of 04/05/2024                        %%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/
// return (
//     <>
//       <IonMenu contentId="main-content" ref={menuRef}>
//         <IonHeader>
//           <IonToolbar>
//             <IonTitle id="yourAccount">Your Account</IonTitle>
//           </IonToolbar>
//         </IonHeader>
//         <IonContent className="ion-padding">
//           <div className="profile">
//             <img
//               src={userPhotoUrl || "../../public/test_logo.jpg"}
//               alt="User Profile"
//             />
//             <h1 id="userName">{userName}</h1> {/* Display the user's name */}
//             <IonButton id="logoutButton" onClick={logout}>Logout</IonButton>
//           </div>
//         </IonContent>
//       </IonMenu>

//       <IonPage id="main-content">
//         <IonButtons slot="start">
//           <IonMenuButton></IonMenuButton>
//         </IonButtons>

//         <IonContent fullscreen>
//           <IonHeader collapse="condense">
//             <IonToolbar>
//               <IonTitle size="large">Holla</IonTitle>
//             </IonToolbar>
//           </IonHeader>
//           <div id="instructions">
//             <p>
//               To load audition data, paste the URL of the Sheet associated with
//               your audition Form, and click 'View Auditions'
//             </p>
//           </div>
//           <div id="url_submission">
//             <IonInput
//               label="URL:"
//               value={givenUrl}
//               ref={ionInputEl}
//               onIonInput={handleInput}
//             ></IonInput>

//             <IonButton id="auditionsButton"onClick={handleClick}>View Auditions</IonButton>
//           </div>

//           <div id="form_data_summary">
//             <h2>Auditions:</h2>
//             <p> Select a name to view a single audition</p>
//             <IonButton id="expandButton"onClick={expandAll}>Expand All</IonButton>
//             <IonButton id="collapseButton"onClick={collapseAll}>Collapse All</IonButton>
//             {data && (
//               <ul>
//                 {data.map(
//                   (row: any, rowIndex: number) =>
//                     rowIndex > 0 && (
//                       // Summary for each form
//                       <li key={rowIndex}>
//                         <details>
//                           <summary>{data[rowIndex][nameCol]}</summary>
//                           <ul>
//                             {Object.entries(row).map(
//                               ([columnName, columnData], cellIndex: number) =>
//                                 // Summary for each field in the form IF it's not null (MISSING)
//                                 !nullCols.includes(parseInt(columnName)) && (
//                                   <li key={columnName}>
//                                     {parseInt(columnName) === urlColumn ? (
//                                       <img
//                                         src={generateThumbnailUrl(
//                                           extractIdFromUrl(columnData)
//                                         )}
//                                         alt="Thumbnail"
//                                       />
//                                     ) : (
//                                       <>
//                                         <strong>
//                                           {formFields[parseInt(columnName)]}:{" "}
//                                           <br />{" "}
//                                         </strong>
//                                         {columnData}
//                                       </>
//                                     )}
//                                   </li>
//                                 )
//                             )}
//                           </ul>
//                         </details>
//                       </li>
//                     )
//                 )}
//               </ul>
//             )}
//           </div>
//         </IonContent>
//         <IonFooter>
//           <IonToolbar>
//             <div>
//               <p>
//                 {" "}
//                 Select 'Export All' to export all auditions as a single .pdf
//                 files
//               </p>
//               {/* <p> Select 'Clear Data' to clear all data</p> */}
//               <div>

//                 <IonButton id="exportButton">Export All</IonButton>
//                 {/* <IonButton>Clear Data</IonButton> */}
//               </div>
//             </div>
//           </IonToolbar>
//         </IonFooter>
//       </IonPage>
//     </>
//   );

export default HomePage;
