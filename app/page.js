'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Footer from './penguinChatbot/footer';
import '../styles/globals.css';


/**
 * HomePage serves as the main entry view for the application, featuring a typing animation
 * that dynamically displays a promotional message about the service's capabilities. This page
 * is designed to welcome users with a striking visual layout that splits the screen into two
 * main areas: one showcasing the company logo and the animated text, and the other offering
 * quick access to login and signup options.
 *
 * The component utilizes an useEffect hook to manage the typing animation, automatically starting
 * and resetting it to maintain user engagement. Additionally, it integrates a Footer component for
 * consistent informational display across the site.
 *
 * @returns {React.ReactElement} A component that renders the homepage layout with a typing animation,
 * login/signup links, and a footer.
 */

function HomePage() {
  const [typedText, setTypedText] = useState('');
  const textToType = "Effortlessly convert PDF Files to HL7.";
  const typingSpeed = 50;

  useEffect(() => {
    let currentIndex = 0;
    const intervalId = setInterval(() => {
      if (currentIndex <= textToType.length) {
        setTypedText(textToType.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(intervalId);
        setTimeout(startTypingAnimation, 1500); 
      }
    }, typingSpeed);

    return () => clearInterval(intervalId);
  }, []); 

  const startTypingAnimation = () => {
    let currentIndex = 0;
    const intervalId = setInterval(() => {
      if (currentIndex <= textToType.length) {
        setTypedText(textToType.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(intervalId);
        setTimeout(startTypingAnimation, 1500); 
      }
    }, typingSpeed);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow flex h-screen bg-gradient-to-l from-red-300 to-yellow-200">
        {/* Left side */}
        <div className="w-3/5 flex flex-col justify-center items-start">
          <div className="align-self-start mb-10 ml-16">
            <img src="images/logo.png" alt="Company Logo" className="w-56 h-24" />
          </div>

          <div className="text-center ml-16">
            <p className="text-white text-4xl font-bold mb-4">{typedText}</p>
          </div>
        </div>

        {/* Right side */}
        <div className="w-2/5 flex justify-center items-center">
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-white text-4xl font-bold mb-10">Welcome !</h1>
            <div className="flex justify-center space-x-6">
              <div>
                <Link href="/login" className="bg-white text-blue-500 px-6 py-3 rounded-lg shadow-md hover:bg-yellow-300 hover:text-white transition duration-300 ease-in-out">
                  Log in
                </Link>
              </div>
              <div>
                <Link href="/signup" className="bg-white text-blue-500 px-6 py-3 rounded-lg shadow-md hover:bg-red-400 hover:text-white transition duration-300 ease-in-out">
                  Sign up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default HomePage;
