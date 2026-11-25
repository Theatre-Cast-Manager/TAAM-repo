# Overview
The Theatre Audition Application Manager (TAAM) is a hybrid mobile-web application designed to help theatre managers with the casting process. It works in conjunction with Google Forms and Google Sheets to avoid paper applications and ensure that headshots are associated with the correct application. It enables directors to easily collect, and view submitted forms on one screen, and allows completed forms to be exported to a PDF. 

If a theatre uses Google Forms to collect audition applications and connects the form to a Google Sheet, any photographs uploaded to that Form can’t be displayed directly in the Sheet. Instead, the Sheet contains a hyperlink to the photo’s location in the Google Drive. Reviewing applications in this format can be cumbersome. Using TAAM, managers can combine all the form responses for easy viewing on a single page. 

# Features
### Authentication
When users launch TAAM, they are prompted to log in through a process powered by Google’s authentication services. Users are directed to a Google-hosted login screen where they can enter their credentials.

### Retrieving, Parsing and Displaying Sheet Data
The home page contains an input field that accepts a URL to a Google Sheet. The user pastes in the URL for the Sheet associated with their audition Form. TAAM then extracts the Form ID from the link, which is used to query the Google Sheets API.
TAAM extracts the Form’s fields (the questions from the audition Form), which are used to display submission data. It then finds the field containing the applicant’s name, and determines which column holds the URL to the uploaded images.
Next, TAAM creates and displays an HTML details element for each Form response. This appears on the home screen as a collapsable list of each applicant. Clicking on a name expands the element to show all the information supplied by that applicant (a “bundle”), which includes their photograph. Users can expand and collapse a single bundle, or all of them at once by hitting the ‘expand all’ and ‘collapse all’ buttons.

### Exporting Bundles
The bottom of each list item includes a link to export that “bundle” as a PDF file. The file is automatically named according to the convention 'firstname-audition.pdf'. There is a link at the bottom of the home page that can be used to generate a PDF that contains all applications, each one on a separate pages in the file. 

# Technologies
- Ionic Framework with React and Capacitor
- Google Authentication and Firebase
- Google APIs

# Development
TAAM was developed over the course of one semester by a team of computer science and business students. We adopted an agile approach, which allowed us to develop this application using a sequence of iterations. Each iteration included customer feedback and developed new functionality for the application.

# Project Status
This project is no longer actively maintained. Changes to Google’s API access requirements may necessitate additional configuration or modifications before the application can be run.
