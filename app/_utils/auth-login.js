'use client'
import { useState } from 'react';
import { UserAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';  
import NavvBar from '../components/navvbar';
import ThemeSwitcher from '../components/ThemeSwitcher';
import { Card, CardHeader, CardBody, CardFooter, Typography, Input, Checkbox, Button } from "@material-tailwind/react";
import Link from 'next/link';
import { firebase } from '@firebase/app';
import '@firebase/auth';
import { getAuth, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { auth } from '../_utils/firebase';

export const AuthLogin = () => {
  const { onLogin } = UserAuth();  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleUserLogin = async () => {
    // Perform user login time tracking or other tasks.
  };

  const handleUserLogout = async () => {
    // Perform user logout time tracking or other tasks.
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!email || !password) {
        window.alert('Please enter email and password.');
        return;
      }

      let loginSuccessful = false;

      if (email === 'admin' && password === 'adminpassword') {
        console.log('Admin login attempted');
        await handleUserLogin(); // Perform user login time tracking
        router.push('/admin');
        loginSuccessful = true;
      } else {
        await onLogin(email, password);
        await handleUserLogin(); // Perform user login time tracking
        router.push('/journal'); // Only navigate if login is successful
        loginSuccessful = true;
      }

      if (!loginSuccessful) {
        window.alert('Incorrect email or password. Please try again.');
      }
    } catch (error) {
      console.error('Login failed', error);
      window.alert(`Login failed: ${error.message}`);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push('journal'); 
    } catch (error) {
      console.error("Google Sign-In failed:", error);
      window.alert(`Google Sign-In failed: ${error.message}`);
    }
  };

  const handleGithubSignIn = async () => {
    try {
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);
      router.push('journal'); 
    } catch (error) {
      console.error("GitHub Sign-In failed:", error);
      window.alert(`GitHub Sign-In failed: ${error.message}`);
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      const provider = new FacebookAuthProvider();
      await signInWithPopup(auth, provider);
      router.push('journal'); 
    } catch (error) {
      console.error("GitHub Sign-In failed:", error);
      window.alert(`GitHub Sign-In failed: ${error.message}`);
    }
  };

  const handleSignUpClick = () => {
    router.push('/signup'); 
  };
  
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };
  
  const bgClass = isDarkMode ? 'bg-gray-800 text-white' : ' text-black';
  const cardClass = isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black';

  return (
    <div 
      className={`min-h-screen flex flex-col items-center justify-center ${bgClass}`}
      style={{
        background: isDarkMode ? 'linear-gradient(to bottom right, #1f2937, #111827)' : 'linear-gradient(to bottom right, #99c0ff, #ff99e6)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className={`absolute top-0 right-0 flex flex-col mr-4 mt-4`}>
        <div className="relative">
          <ThemeSwitcher isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        </div>
      </div>
      <Card className={`w-96 p-4 rounded-2xl shadow-lg relative z-10 mt-16 ${cardClass}`}>
        <div className="my-4 grid h-15 place-items-center text-center">
          <h1 className="font-bold text-2xl ">Sign In</h1>
        </div>
        <CardBody className={`flex flex-col gap-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>
          <div className={`text-gray-600 ${isDarkMode ? 'text-white' : ''}`}>Email</div>
          <div className="relative">
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-b-2 border-gray-400 focus:border-purple-500 transition-all duration-300 bg-transparent outline-none w-full"
              placeholder="Enter email"
            />
            <div className="absolute inset-x-0 bottom-0 h-1 bg-transparent origin-left transform transition-transform duration-300 hover:scale-x-100"></div>
          </div>
          <div className={`text-gray-600 ${isDarkMode ? 'text-white' : ''}`}>Password</div>
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-b-2 border-gray-400 focus:border-purple-500 transition-all duration-300 bg-transparent outline-none w-full"
              placeholder="Enter password" 
            />
            <div className="absolute inset-x-0 bottom-0 h-1 bg-transparent origin-left transform transition-transform duration-300 hover:scale-x-100"></div>
          </div>
          <label className="flex items-center cursor-pointer hover:bg-purple-100 p-1 rounded">
            <Checkbox className="mr-2" />
            <Typography className={`text-gray-600 ${isDarkMode ? 'text-white' : ''}`}>Remember Me</Typography>
          </label>
          <Button
            variant="gradient"
            color="white"
            fullWidth
            className="bg-purple-300 text-white hover:bg-purple-500 transition-colors duration-300 rounded-3xl "
            onClick={handleSubmit}
          >
            Sign In
          </Button>
          <div className="flex items-center justify-center space-x-2"> 
            <Typography variant="paragraph" className={`text-gray-600 ${isDarkMode ? 'text-white' : ''}`}>
              Or sign in with
            </Typography>
          </div>
          <div className={`flex items-center justify-center ${cardClass}`}>
            <div className="p-3 rounded-full cursor-pointer">
              <img src="/images/google.png" alt="Google Icon" className="h-6 w-6" onClick={handleGoogleSignIn} />
            </div>
            <div className="bg-white rounded-full cursor-pointer">
              <img src="/images/github3.png" alt="GitHub Icon" className="h-6 w-6" onClick={handleGithubSignIn} />
            </div>
            <div className="p-3 rounded-full cursor-pointer">
              <img src="/images/facebook.png" alt="Facebook Icon" className="h-6 w-6" onClick={handleFacebookSignIn} /> 
            </div>        
          </div>
        </CardBody>
        <CardFooter className="pt-0">
          <Typography variant="small" className={`flex justify-center text-gray-600 ${isDarkMode ? 'text-white' : ''}`}>
            Don&apos;t have an account?
            <Typography
              as="button"
              onClick={handleSignUpClick} 
              variant="small"
              color="blue-gray"
              className="ml-1 font-bold"
            >
              Sign up
            </Typography>
          </Typography>
        </CardFooter>
      </Card>
      <button
        onClick={() => {
          router.push('/');
        }}
        className={`bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-900 transition duration-300 absolute bottom-4 right-4 ${isDarkMode ? 'hover:text-white' : 'hover:text-black'}`}
      >
        Back
      </button>
    </div>
  );
};