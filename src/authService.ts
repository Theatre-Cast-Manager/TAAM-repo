import {
  getAuth,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
} from "firebase/auth";
import { app } from "./firebaseConfig";

const provider = new GoogleAuthProvider();
const auth = getAuth(app);

const handleLogin = () => {
  return signInWithPopup(auth, provider);
};

const handleLogout = () => {
  return signOut(auth);
};

export { handleLogin, handleLogout };
