'use client'
import React from 'react';
import { Auth } from '../_utils/auth-signup';

/**
 * SignUpPage is a simple container component that renders the Auth component configured for user sign-up.
 * This page is typically accessed by new users needing to create an account. The component leverages the Auth
 * module from the application's utilities to handle the registration process, abstracting the specifics of
 * user authentication and data handling.
 *
 * @component
 * @returns {React.ReactElement} Renders the sign-up interface for the application, facilitating new user registration.
 */

const SignUpPage = () => {
  return (
    <div>

        <Auth />
      
    </div>
  );
};

export default SignUpPage;
