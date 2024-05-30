import React from 'react'
import type { AppProps } from 'next/app'
import {
  ClerkProvider,
  SignInButton,
  SignOutButton,
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
            <div className="flex flex-col w-full gap-y-5 min-h-screen items-center p-5 justify-center">
              <div className="flex flex-col gap-y-4">
              <div className="flex text-center text-5xl flex-col">
                OneAI  
              </div>
              <div className="flex text-center text-2xl flex-col">
                 Project Readme Generator
              </div>

              </div>
              <div className='p-3 border text-md rounded-2xl'>
            <SignInButton>
          
              Sign in
              </SignInButton>

              </div>
            </div>
          </body>
        </html>
      </SignedOut>
      <SignedIn>
        <SignOutButton/>
      <Component {...pageProps} />
       </SignedIn>
    </ClerkProvider>
)
}

export default MyApp
