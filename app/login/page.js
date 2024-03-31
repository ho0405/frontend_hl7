'use client'
import { useState } from "react";
import React from 'react';
import Link from "next/link";
import { AuthLogin } from "../_utils/auth-login";
import ThemeSwitcher from '../components/ThemeSwitcher';

const LogInPage = () => {

  return (
    <div>
      <AuthLogin />
    </div>
  );
};

export default LogInPage;
