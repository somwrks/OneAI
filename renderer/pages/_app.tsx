import React from 'react'
import type { AppProps } from 'next/app'
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";

import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  
return(
   <ClerkProvider publishableKey='pk_test_dW5pcXVlLWdvYmxpbi04Mi5jbGVyay5hY2NvdW50cy5kZXYk'>
      <SignedOut>
        <html>
          <body>
            <div className="flex flex-col w-full min-h-screen items-center justify-center">
            <SignInButton>
          
              Sign in
              </SignInButton>
            </div>
          </body>
        </html>
      </SignedOut>
      <SignedIn>
      <Component {...pageProps} />
       </SignedIn>
    </ClerkProvider>
)
}

export default MyApp
