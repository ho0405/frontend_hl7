import { createContext, useContext, useEffect, useState } from 'react';
import { collection, doc, setDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, GithubAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { auth, db } from '../_utils/firebase';

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const logOut = () => {
    signOut(auth);
  };

  const onLogin = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const loggedInUser = userCredential.user;
      console.log(loggedInUser);
      setUser(loggedInUser);
 
      // Log the email and current timestamp to Firestore
      const loginRef = doc(collection(db, "logins"));
      await setDoc(loginRef, {
        email: email, // Log the email
        timestamp: new Date() // Add the current timestamp
      });
      console.log("Email and timestamp logged in Firestore successfully.");

    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error during login:", errorCode, errorMessage);
    }
  };

  const googleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google Sign-In failed:", error);
      window.alert(`Google Sign-In failed: ${error.message}`);
    }
  };

  const GithubSignIn = async () => {
    try {
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google Sign-In failed:", error);
      window.alert(`Google Sign-In failed: ${error.message}`);
    }
  };
  
  const FacebookSignIn = async () => {
    try {
      const provider = new FacebookAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google Sign-In failed:", error);
      window.alert(`Google Sign-In failed: ${error.message}`);
    }
  };


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, googleSignIn, GithubSignIn, FacebookSignIn, logOut, onLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};