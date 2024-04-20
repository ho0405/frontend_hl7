'use client'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthContextProvider } from './context/AuthContext'
import '../styles/globals.css';


/**
 * RootLayout is the top-level component wrapper for the entire application. It integrates the AuthContextProvider
 * to ensure that authentication context is available throughout the component hierarchy. This component also 
 * sets the global font style using the 'Inter' font imported from Google Fonts, and applies global CSS styles.
 *
 * The RootLayout sets up the essential structure of the application's HTML and body elements, including language
 * settings and CSS class applications derived from the 'Inter' font style.
 *
 * @param {Object} props - The props passed to the component.
 * @param {React.ReactNode} props.children - Child components that will be rendered inside the AuthContextProvider.
 * @returns {React.ReactElement} The top-level HTML structure of the application, including context providers and styling.
 */

const inter = Inter({ subsets: ['latin'] })


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthContextProvider>
          {children}
        </AuthContextProvider>
      </body>
    </html>
  )
}