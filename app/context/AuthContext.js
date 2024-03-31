import { useContext, createContext, useState, useEffect } from 'react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, collection } from 'firebase/firestore'; // Import additional Firestore functions
import { auth, db } from '../_utils/firebase'; // Ensure you're importing your Firestore instance as `db`

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


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, logOut, onLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
