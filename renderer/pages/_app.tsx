import React from 'react'
import type { AppProps } from 'next/app'
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";

import '../styles/globals.css'
import LoginPage from '../components/LoginPage';
import Navbar from '../components/Navbar';

function MyApp({ Component, pageProps }: AppProps) {
return(
   <ClerkProvider publishableKey='pk_test_dW5pcXVlLWdvYmxpbi04Mi5jbGVyay5hY2NvdW50cy5kZXYk' >
      <SignedOut>
        <html>
          <body >
            <Navbar/>
          <LoginPage/>
          </body>
        </html>
      </SignedOut>
      <SignedIn>
            <Navbar/>
      <Component {...pageProps} />
    </SignedIn>
     </ClerkProvider>
)
}

export default MyApp
