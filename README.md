Local running:
- `npm start`
- default port is 3000 (`http://localhost:3000`)
- you should have `.env` set up with your firebase credentials in order to use the authentication.
  sample:
  ```
    REACT_APP_FIREBASE_API_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0
    REACT_APP_FIREBASE_AUTH_DOMAIN=project-id-1234.firebaseapp.com
    REACT_APP_FIREBASE_PROJECT_ID=project-id-1234
    REACT_APP_FIREBASE_STORAGE_BUCKET=project-id-1234.appspot.com
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID=1234567890
    REACT_APP_FIREBASE_APP_ID=1:1234567890:web:1234567890abcdef
    REACT_APP_FIREBASE_AUTH_WEB_CLIENT_ID=1234567890-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com
    REACT_APP_FIREBASE_AUTH_WEB_CLIENT_SECRET=abcdefghijklmnopqrstuvwxyz1234567890
  ```