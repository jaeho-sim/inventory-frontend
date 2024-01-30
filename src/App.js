import { useContext } from 'react';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, signOut, GoogleAuthProvider } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import Inventory from './Inventory';
import { AuthContext } from './contexts';
import './App.scss';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

const Navbar = () => {
  const authData = useContext(AuthContext);
  const { user, loading, error, login, logout } = authData;

  console.log('user', user)
  return (
    <div className="navbar">
      <h3>Inventory App</h3>
      <div className="navbar-auth">
        { loading ?
            <p>Loading...</p> :
            error ?
              <p>Error: {error}</p> :
              user ?
                <><button onClick={logout}>Log out</button><p>Logged in as <br /><b>{user.displayName}</b></p></> :
                <button onClick={login}>Log in</button>
        }
      </div>
      <hr />
    </div>
  );
};

function App() {
  const [user, loading, error] = useAuthState(auth);

  const login = () => {
    signInWithPopup(auth, new GoogleAuthProvider())
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        // const credential = GoogleAuthProvider.credentialFromResult(result);
        // const token = credential.accessToken;
        // The signed-in user info.
        // const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      }).catch((error) => {
        // Handle Errors here.
        // const errorCode = error.code;
        // const errorMessage = error.message;
        // The email of the user's account used.
        // const email = error.customData.email;
        // The AuthCredential type that was used.
        // const credential = GoogleAuthProvider.credentialFromError(error);
        console.log('error', error)
        // ...
      });
  };
  const logout = () => {
    signOut(auth);
  };

  const authData = { user, loading, error, login, logout };

  return (
    <AuthContext.Provider value={authData}>
      <div className="App">
      <div className="App-page">
          <Navbar />
          <Inventory />
      </div>
    </div>
    </AuthContext.Provider>
  );
}

export default App;
