# What is ionictemplate?

ionictemplate is a basic template ionic 4 and angular 6 fully functional, provide one page of login, signup and forgot password using firebase like a BaaS.

# Features

1. Provide a page login with 3 options: user and email, log in with facebbok and log in to google.
2. Provide a page signup with user and email, facebook and google.
3. Using [ngx/translate](https://github.com/ngx-translate/core) for language handling.
4. Implements 

# Prerequisites

1. Angular 6.
2. Ionic v4.
3. Have a project created in firebase.
4. Have activated the providers of facebook, google and user and password.
5. Have activated a database cloud firestore.

# How to use?

1. Clone this repository.
2. Download all dependencies

```bash
 npm install
```
3. Edit the file app.module.ts.
4. Go to the firebase console, open your project, get the project configuration and replace it in the section of the file app.module.ts:

```bash
export const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: ""
};
```

5. run the server
```bash
ionic serve
```
