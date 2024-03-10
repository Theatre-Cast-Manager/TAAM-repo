// Import Statements:
import React from 'react';  //imports the React library, enabling use of JSX and React components.
import ReactDOM from 'react-dom';   //DEPRECIATED?
import { GoogleOAuthProvider } from '@react-oauth/google';  // imports a component that provides OAuth functionality for Google sign-in, to manage OAuth flow
import { createRoot } from 'react-dom/client';  // imports the createRoot method, part of the newer React 18 API for rendering application more efficiently
import App from './App';    // imports the main App component of your React application, which likely contains the structure or routing of your entire application.

// Setting Up the Container:
const container = document.getElementById('root');
const root = createRoot(container!);

// Rendering the App:
root.render(
                        // clientId is a unique identifier assigned by Google when you register your application in the Google Cloud Console. Used by Google to recognize your application and allows it to perform authentication requests on behalf of your app
    <GoogleOAuthProvider clientId="20455228671-ikq199igpls7j0l23oeks3llsdd4gce4.apps.googleusercontent.com"> {/* using 'Web client' client ID from GCConsole*/}
        <React.StrictMode>
            <App />
        </React.StrictMode>
    </GoogleOAuthProvider>
);