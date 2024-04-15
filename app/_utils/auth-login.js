'use client'
import { useState } from 'react';
import { UserAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';  
import NavvBar from '../components/navvbar';
import '../../styles/globals.css';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Checkbox,
  Button,
} from "@material-tailwind/react";

export const AuthLogin = () => {
  const { onLogin } = UserAuth();  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

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
        router.push('/admin');
        loginSuccessful = true;
      } else {
        await onLogin(email, password);
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
  

  const handleSignUpClick = () => {
    router.push('/signup'); // Navigate to the signup page
  };
  
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center "
      style={{
        backgroundImage: "url('/images/background.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className='absolute top-0 w-full'>
        <NavvBar/>
      </div>
      {/* <div 
        className="absolute top-0 left-0 w-full h-full bg-white bg-opacity-50" 
      ></div> */}
      <Card className="w-96 bg-white p-8 rounded shadow-lg relative z-10 mt-8"> {/* z-index 추가 */}
        <CardHeader
          variant="gradient"
          className="mb-4 grid h-16 place-items-center"
        >
          <Typography variant="h3">
            Sign In
          </Typography>
        </CardHeader>
        <CardBody className="flex flex-col gap-4">
          <Typography variant="paragraph" className="text-gray-600">Email</Typography>
          <Input
            size="lg"
            style={{ width: '100%' }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Typography variant="paragraph" className="text-gray-600">Password</Typography>
          <Input
            size="lg"
            type="password"
            style={{ width: '100%' }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="mb-4">
            <Checkbox label="Remember Me" />
          </div>
          <Button variant="gradient" color="white" fullWidth onClick={handleSubmit}>
            Sign In
          </Button>
        </CardBody>
        <CardFooter className="pt-0">
          <Typography variant="small" className="mt-6 flex justify-center text-gray-600">
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
        className="fixed bottom-20 right-20 bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-900 transition duration-300"
      >
        Back
      </button>
    </div>
  );
};
