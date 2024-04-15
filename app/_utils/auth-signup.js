'use client'
import { auth } from "./firebase";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useState } from "react";
import { useRouter } from 'next/navigation';  
import ThemeSwitcher from "../components/ThemeSwitcher";
import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Input,
  Button,
  CardFooter,
} from "@material-tailwind/react";

export const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const signUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      window.alert('User signed up successfully!'); 
      console.log(user);
      router.push('/login');
    } catch (error) {
      window.alert(`Sign up failed: ${error.message}`); 
      console.error("Sign up failed:", error.message);
    }
  };

  const handleBackButtonClick = () => {
    router.push('/');
  };

  
  const handleSignInClick = () => {
    router.push('/login'); 
  };

  
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };
  
  const bgClass = isDarkMode ? 'bg-gray-800 text-white' : ' text-black';
  const cardClass = isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black';

  return (
    <div 
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        background: isDarkMode ? 'linear-gradient(to bottom right, #1f2937, #111827)' : 'linear-gradient(to bottom right, #99c0ff, #ff99e6)',
      }}
    >
            <div className={`absolute top-0 right-0 flex flex-col mr-4 mt-4`}>
        <div className="relative">
          <ThemeSwitcher isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        </div>
      </div>
      <div className="flex min-h-screen items-center justify-center">
        <Card className={`w-96 p-4 rounded-2xl shadow-lg ${cardClass} `}>
          <div className="my-4 grid h-15 place-items-center text-center">
            <h1 className="font-bold text-2xl ">Sign Up</h1>
          </div>
          <CardBody className="flex flex-col gap-4">
            <Typography variant="paragraph" className={`text-gray-600 ${isDarkMode ? 'text-white' : 'text-black'}`}>
              Email
            </Typography>
            <div className="relative">
              <input
                size="lg"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`border-b-2 border-gray-400 focus:border-purple-500 transition-all duration-300 bg-transparent outline-none w-full ${isDarkMode ? 'text-white' : 'text-black'}`}
                placeholder="Enter Email"
              />
              <div className="absolute inset-x-0 bottom-0 h-1 bg-transparent origin-left transform transition-transform duration-300 hover:scale-x-100"></div>
            </div>
            <Typography variant="paragraph" className={`text-gray-600 ${isDarkMode ? 'text-white' : 'text-black'}`}>
              Password
            </Typography>
            <div className="relative">
              <input
                size="lg"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`border-b-2 border-gray-400 focus:border-purple-500 transition-all duration-300 bg-transparent outline-none w-full ${isDarkMode ? 'text-white' : 'text-black'}`}
                placeholder="Enter Password"
              />
              {/* <div className="absolute inset-x-0 bottom-0 h-1 bg-transparent origin-left transform transition-transform duration-300 hover:scale-x-100"></div> */}
            </div>
            <Button
            variant="gradient"
            color="white"
            fullWidth
            className="bg-purple-300 text-white hover:bg-purple-500 transition-colors duration-300 rounded-3xl mt-4"
            onClick={signUp}
            >
              Sign Up
            </Button>
          </CardBody>
          <CardFooter className="pt-0">
          <Typography variant="small" className={`flex justify-center text-gray-600  ${isDarkMode ? 'text-white' : ''}`}>
            Already have an account?
            <Typography
              as="button"
              onClick={handleSignInClick} 
              variant="small"
              color="blue-gray"
              className="ml-1 font-bold"
            >
              Sign In
            </Typography>
          </Typography>
        </CardFooter>
        </Card>
        <button
          className={`bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-900 transition duration-300 absolute bottom-4 right-4 ${isDarkMode ? 'hover:text-white' : 'hover:text-black'}`}
          onClick={handleBackButtonClick}
        >
          Back
        </button>
      </div>
    </div>
  );
};