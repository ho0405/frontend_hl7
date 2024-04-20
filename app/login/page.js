'use client'
import { useState } from "react";
import React from 'react';
import Link from "next/link";
import { AuthLogin } from "../_utils/auth-login";
import ThemeSwitcher from '../components/ThemeSwitcher';

/**
 * LogInPage is a simple container component that primarily renders the AuthLogin component,
 * which handles user authentication. This page serves as the entry point for users needing to log into the application.
 *
 * @component
 * @returns {React.ReactElement} Renders the login interface for the application.
 */

const LogInPage = () => {

  return (
    <div>
      <AuthLogin />
    </div>
  );
};

export default LogInPage;
